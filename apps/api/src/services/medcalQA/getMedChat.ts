import bedrockModel from './bedrockModel'
import { streamText } from 'ai'

/**
 * AWS Bedrock Claude 모델을 사용하여 의료 관련 채팅 응답을 생성합니다.
 * @param params - 입력 메시지 객체
 * @returns Claude 모델의 응답 메시지
 */
export const getMedChat = (message: string) => {
  // const qaChain = await getQAChain()
  // const clarifyInput = await clarifyChain.invoke({ input: message })

  return streamText({
    model: bedrockModel, // 사용하는 모델 지정
    prompt: message
  })
}
