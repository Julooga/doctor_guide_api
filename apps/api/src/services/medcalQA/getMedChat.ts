import { clarifyChain, getQAChain, summarizeChain } from './medicalChains'

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
  message,
  conversations
}: GetMedChatParams): Promise<{
  clarifyNeeded: boolean
  message: string
  conversations: string[]
}> => {
  try {
    const qaChain = await getQAChain()
    const clarify = await clarifyChain.invoke({ input: message })

    if (clarify.startsWith('clarify:')) {
      return {
        clarifyNeeded: true,
        message: clarify.replace('clarify:', '').trim(),
        conversations
      }
    }

    const response = await qaChain.invoke({ input: clarify })

    const newconversations = [
      ...conversations,
      `User: ${message}`,
      `Assistant: ${response.answer}`
    ]

    if (newconversations.length >= 10) {
      const summary = await summarizeChain.invoke({
        messages: conversations.join('\n')
      })

      return {
        clarifyNeeded: false,
        message: response.answer,
        conversations: [summary]
      }
    }

    return {
      clarifyNeeded: false,
      message: response.answer,
      conversations: newconversations
    }
  } catch (error) {
    console.warn('Bedrock API 오류 발생, 모의 응답 사용:', error)
    
    // 모의 응답 체인 사용
    const clarify = await clarifyChain.invoke({ input: message })

    if (clarify.startsWith('clarify:')) {
      return {
        clarifyNeeded: true,
        message: clarify.replace('clarify:', '').trim(),
        conversations
      }
    }

    const response = await qaChain.invoke({ input: clarify })

    const newconversations = [
      ...conversations,
      `User: ${message}`,
      `Assistant: ${response.answer}`
    ]

    if (newconversations.length >= 10) {
      const summary = await summarizeChain.invoke({
        messages: conversations.join('\n')
      })

      return {
        clarifyNeeded: false,
        message: response.answer,
        conversations: [summary]
      }
    }

    return {
      clarifyNeeded: false,
      message: response.answer,
      conversations: newconversations
    }
  }
}
