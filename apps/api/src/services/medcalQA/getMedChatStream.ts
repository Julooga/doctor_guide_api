import { streamText } from 'ai'
import loadMarkdown from './loadMarkdown'
// RAG를 위한 서비스 import
import getHospitalPoiData from '../hospital/getHospitalPoiData'
import getPharamacyPoiData from '../pharamacy/getPharamacyPoiData'
import bedrockModel from './bedrockModel'

type EnhancedMessageParams = {
  contextData: string | null
  message: string
}

// ✅ 순수함수로 변경
const getEnhancedMessage = ({
  contextData,
  message
}: EnhancedMessageParams): string => {
  if (contextData) {
    return `${message}\n\n참고 정보:\n${contextData}`
  }

  return message
}

type HospitalInfo = {
  name: string
  address: string
}

type PharmacyInfo = {
  name: string
  address: string
}

// ✅ 순수함수로 분리
const formatHospitalInfo = (hospitals: HospitalInfo[]): string => {
  const hospitalList = hospitals
    .map((data) => `- ${data.name} (${data.address})`)
    .join('\n')

  return `관련 병원 정보:\n${hospitalList}`
}

// ✅ 순수함수로 분리
const formatPharmacyInfo = (pharmacies: PharmacyInfo[]): string => {
  const pharmacyList = pharmacies
    .map((data) => `- ${data.name} (${data.address})`)
    .join('\n')

  return `관련 약국 정보:\n${pharmacyList}`
}

type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * AWS Bedrock Claude 모델을 사용하여 의료 관련 채팅 응답을 텍스트 스트리밍으로 생성합니다.
 * RAG를 통해 병원/약국 데이터를 포함한 컨텍스트를 제공합니다.
 */
export const getMedChatStream = async (messages: Message[]) => {
  try {
    const systemPrompt = loadMarkdown('./prompts/qa/system.md')

    // 마지막 사용자 메시지에서 컨텍스트 추출
    const userMessages = messages.filter((msg) => msg.role === 'user')
    const lastUserMessage = userMessages[userMessages.length - 1]

    // RAG: 관련 데이터 검색
    const contextData = await buildContextData({
      message: lastUserMessage?.content || '',
      includeHospitalData: true,
      includePharamacyData: true,
      searchLocation: ''
    })

    // 시스템 메시지 구성 - 텍스트 응답 요구사항
    const enhancedSystemPrompt = `${systemPrompt}

당신은 의료 전문가로서 환자의 질문에 친절하고 정확하게 답변해야 합니다.
답변은 다음 구조로 작성해주세요:

## 답변
[환자의 질문에 대한 상세하고 이해하기 쉬운 의료 정보 답변]

## 추천사항
- [증상 완화나 건강 관리를 위한 구체적인 추천 사항]
- [추가 추천사항들...]

## 심각도
[낮음/보통/높음/응급 중 하나]

## 권장 행동
- [환자가 취해야 할 구체적인 행동 지침]
- [추가 행동 지침들...]

## 주의사항
이 정보는 의학적 조언을 대체할 수 없습니다. 심각한 증상이나 응급상황에는 즉시 의료진에게 연락하세요.`

    // if (contextData) {
    //   enhancedSystemPrompt +=
    //     '\n\n## 관련 병원/약국 정보\n병원 및 약국 정보가 답변에 포함되었습니다.'
    // }

    const systemMessage: Message = {
      role: 'system',
      content: enhancedSystemPrompt
    }

    // 컨텍스트가 있는 경우 마지막 사용자 메시지에 추가
    const processedMessages = messages.map((msg, index) => {
      if (msg.role === 'user' && index === messages.length - 1 && contextData) {
        return {
          ...msg,
          content: getEnhancedMessage({
            message: msg.content,
            contextData
          })
        }
      }

      return msg
    })

    // 전체 대화 히스토리 구성
    const conversationMessages = [systemMessage, ...processedMessages]

    const result = await streamText({
      model: bedrockModel,
      messages: conversationMessages,
      maxTokens: 2000,
      temperature: 0.3,
      maxRetries: 2,
      onFinish: (finishResult: {
        finishReason?: string
        usage?: unknown
        text?: string
      }) => {
        console.log('Stream finished successfully:', {
          finishReason: finishResult.finishReason,
          usage: finishResult.usage,
          hasContext: !!contextData,
          text: finishResult.text
        })
      },
      onError: (errorEvent: { error: unknown }) => {
        console.error('Stream error occurred:', errorEvent.error)
      }
    })

    console.log('streamText result created successfully with RAG context')

    return result
  } catch (error) {
    console.error('Error in getMedChatStream:', error)

    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }

    // AWS SDK 에러 체크
    if (error && typeof error === 'object' && 'name' in error) {
      const awsError = error as Record<string, unknown>
      console.error('AWS Error details:', {
        name: awsError.name,
        code: (awsError.$metadata as Record<string, unknown>)?.httpStatusCode,
        requestId: (awsError.$metadata as Record<string, unknown>)?.requestId
      })
    }

    throw error
  }
}

type ContextParams = {
  message: string
  includeHospitalData: boolean
  includePharamacyData: boolean
  searchLocation?: string
}

/**
 * 병원 정보를 가져와서 포맷팅된 문자열로 반환합니다.
 */
const getHospitalContext = async (
  locationQuery: string
): Promise<string | null> => {
  const hospitalData = await getHospitalPoiData({
    ADDR: locationQuery,
    limit: 5
  })

  if (hospitalData.list.length === 0) {
    return null
  }

  const hospitals = hospitalData.list.map((hospital) => {
    return {
      name: hospital.FIAI_MDLCR_INST_CD_NM || '',
      address: hospital.ADDR || ''
    }
  })

  return formatHospitalInfo(hospitals)
}

/**
 * 약국 정보를 가져와서 포맷팅된 문자열로 반환합니다.
 */
const getPharmacyContext = async (
  locationQuery: string
): Promise<string | null> => {
  const pharmacyData = await getPharamacyPoiData({
    ADDR: locationQuery,
    limit: 5
  })

  if (pharmacyData.list.length === 0) {
    return null
  }

  const pharmacies = pharmacyData.list.map((pharmacy) => {
    return {
      name: pharmacy.INST_NM || '',
      address: pharmacy.ADDR || ''
    }
  })

  return formatPharmacyInfo(pharmacies)
}

/**
 * 병원 컨텍스트를 조건부로 가져오는 함수
 */
const getConditionalHospitalContext = async (params: {
  includeHospitalData: boolean
  locationQuery: string
}): Promise<string | null> => {
  const { includeHospitalData, locationQuery } = params

  if (!includeHospitalData) {
    return null
  }

  return getHospitalContext(locationQuery)
}

/**
 * 약국 컨텍스트를 조건부로 가져오는 함수
 */
const getConditionalPharmacyContext = async (params: {
  includePharamacyData: boolean
  locationQuery: string
}): Promise<string | null> => {
  const { includePharamacyData, locationQuery } = params

  if (!includePharamacyData) {
    return null
  }

  return getPharmacyContext(locationQuery)
}

/**
 * 컨텍스트 데이터 조건부 수집을 위한 헬퍼 함수
 */
const collectContextData = async (params: {
  includeHospitalData: boolean
  includePharamacyData: boolean
  locationQuery: string
}): Promise<string[]> => {
  const { includeHospitalData, includePharamacyData, locationQuery } = params

  const contextPromises = await Promise.all([
    getConditionalHospitalContext({ includeHospitalData, locationQuery }),
    getConditionalPharmacyContext({ includePharamacyData, locationQuery })
  ])

  return contextPromises.filter(Boolean) as string[]
}

/**
 * 사용자 메시지를 분석하여 관련 컨텍스트 데이터를 구축합니다.
 */
const buildContextData = async ({
  message,
  includeHospitalData,
  includePharamacyData,
  searchLocation
}: ContextParams): Promise<string | null> => {
  try {
    // 메시지에서 위치 정보 추출 (간단한 키워드 기반)
    const locationQuery = searchLocation ?? extractLocationFromMessage(message)

    if (!locationQuery) {
      return null
    }

    const contextParts = await collectContextData({
      includeHospitalData,
      includePharamacyData,
      locationQuery
    })

    if (contextParts.length === 0) {
      return null
    }

    return contextParts.join('\n\n')
  } catch (error) {
    console.warn('Failed to build context data:', error)

    return null
  }
}

/**
 * 메시지에서 위치 정보를 추출합니다.
 * 실제 구현에서는 더 정교한 NLP 로직을 사용할 수 있습니다.
 */
const extractLocationFromMessage = (message: string): string | null => {
  // 간단한 키워드 기반 위치 추출
  const locationKeywords = [
    '강남',
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산'
  ] as const

  return locationKeywords.find((keyword) => message.includes(keyword)) || null
}
