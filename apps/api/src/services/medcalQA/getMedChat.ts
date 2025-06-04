import { clarifyChain, getQAChain } from './medicalChains'

type GetMedChatParams = {
  message: string
  conversations: string[]
}

/**
 * AWS Bedrock Claude 모델을 사용하여 의료 관련 채팅 응답을 생성합니다.
 * @param params - 입력 메시지 객체
 * @returns Claude 모델의 응답 메시지
 */
export const getMedChat = async ({
  message
}: GetMedChatParams): Promise<{
  clarifyNeeded: boolean
  message: string
}> => {
  const qaChain = await getQAChain()
  const clarifyInput = await clarifyChain.invoke({ input: message })

  if (clarifyInput.startsWith('clarify:')) {
    return {
      clarifyNeeded: true,
      message: clarifyInput.replace('clarify:', '').trim()
    }
  }

  const response = await qaChain.invoke({ input: clarifyInput })

  return {
    clarifyNeeded: false,
    message: response.answer
  }
}
