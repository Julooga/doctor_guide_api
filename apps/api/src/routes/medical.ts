import { createSuccessRoute, createFailRoute } from '@/services/utility'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { z } from 'zod'
import { getMedChat } from '@/services/medcalQA/getMedChat'
import { getMedChatSummary } from '@/services/medcalQA/getMedChatSummary'

// Zod 스키마 정의
const messagePartSchema = z.object({
  type: z.literal('text'),
  text: z.string()
})

const messageRoleSchema = z.enum(['system', 'user', 'assistant'])

const messageSchema = z.object({
  role: messageRoleSchema,
  content: z.string(),
  parts: z.array(messagePartSchema)
})

// 요청/응답 스키마
export const medRequest = z.object({
  id: z.string(),
  messages: z.array(messageSchema)
})

export const medSummeriseRequest = z.object({
  conversations: z.array(z.string())
})

const medRouter = new Hono()

medRouter.post(
  '/chat',
  describeRoute({
    description: '의학적 질문을 sse 스트림으로 답하는 post 메소드',
    responses: {
      200: createSuccessRoute({
        resSchema: medRequest
      }),
      400: createFailRoute()
    }
  }),
  validator('json', medRequest), // query에서 json으로 수정
  async (c) => {
    const { messages = [] } = c.req.valid('json')

    // 마지막 사용자 메시지 추출
    const userMessages = messages.filter((msg) => msg.role === 'user')
    const lastUserMessage = userMessages[userMessages.length - 1]

    if (!lastUserMessage) {
      return c.json({ error: '사용자 메시지가 없습니다.' }, 400)
    }

    const stream = await getMedChat(lastUserMessage.content)

    return stream.toDataStreamResponse({
      headers: {
        'Content-Type': 'text/event-stream'
      }
    })
  }
)

medRouter.post(
  '/summarize',
  describeRoute({
    description: '의학적 대화를 요약하는 post 메소드',
    responses: {
      200: createSuccessRoute({
        resSchema: medSummeriseRequest
      }),
      400: createFailRoute()
    }
  }),
  validator('query', medSummeriseRequest),
  async (c) => {
    const { conversations } = c.req.valid('query')
    const res = await getMedChatSummary(conversations)

    return c.text(res)
  }
)

export default medRouter
