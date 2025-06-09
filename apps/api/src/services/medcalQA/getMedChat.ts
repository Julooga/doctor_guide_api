import bedrockModel from './bedrockModel'
import { streamText } from 'ai'

// Rate Limiting을 위한 간단한 시스템
const rateLimitState = {
  lastRequestTime: 0,
  MIN_REQUEST_INTERVAL: 10000 // 10초 간격
}

const checkRateLimit = async (): Promise<void> => {
  const now = Date.now()
  const timeSinceLastRequest = now - rateLimitState.lastRequestTime

  if (timeSinceLastRequest < rateLimitState.MIN_REQUEST_INTERVAL) {
    const waitTime = rateLimitState.MIN_REQUEST_INTERVAL - timeSinceLastRequest
    console.log(`Rate limiting: waiting ${waitTime}ms before request`)

    await new Promise((resolve) => setTimeout(resolve, waitTime))
  }

  rateLimitState.lastRequestTime = Date.now()
}

/**
 * AWS Bedrock Claude 모델을 사용하여 의료 관련 채팅 응답을 생성합니다.
 * @param message - 입력 메시지 문자열
 * @returns Claude 모델의 응답 메시지
 */
export const getMedChat = async (message: string) => {
  try {
    // Rate Limiting 체크
    await checkRateLimit()

    console.log('getMedChat called with message:', message)
    console.log('Using bedrock model:', bedrockModel)

    const result = await streamText({
      model: bedrockModel,
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      maxTokens: 1000,
      temperature: 0.7,
      maxRetries: 1,
      onFinish: (finishResult) => {
        console.log('Stream finished successfully:', {
          finishReason: finishResult.finishReason,
          usage: finishResult.usage
        })
      },
      onError: (streamError) => {
        console.error('Stream error occurred:', streamError)
      }
    })

    console.log('streamText result created successfully')

    return result
  } catch (error) {
    console.error('Error in getMedChat:', error)

    // 에러 타입별 상세 정보 출력
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
