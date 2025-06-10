import { streamText } from 'ai'
import bedrockModel from './bedrockModel'
import loadMarkdown from './loadMarkdown'

/**
 * AWS Bedrock Claude 모델을 사용하여 의료 관련 채팅 응답을 생성합니다.
 * @param params - 입력 메시지와 프롬프트 타입을 포함한 객체
 * @returns Claude 모델의 응답 메시지
 */
export const getMedChatStream = async (message: string) => {
  try {
    const systemPrompt = loadMarkdown(`./prompts/qa/system.md`)

    const result = await streamText({
      model: bedrockModel,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
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
