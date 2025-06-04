import { summarizeChain } from './medicalChains'

export const getMedChatSummary = (conversations: string[]) => {
  return summarizeChain.invoke({
    messages: conversations.join('\n')
  })
}
