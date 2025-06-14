import { createSuccessRoute, createFailRoute } from '@/services/utility'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { z } from 'zod'
import { getMedChat } from '@/services/medcalQA/getMedChat'
import { getMedChatSummary } from '@/services/medcalQA/getMedChatSummary'
import { getMedChatStream } from '@/services/medcalQA/getMedChatStream'

export const medRequest = z.object({
  message: z.string()
})

export const medSummeriseRequest = z.object({
  conversations: z.string().array()
})

const medRouter = new Hono()

medRouter.post(
  '/chat',
  describeRoute({
    description: '의학적 질문에 답하는 post 메소드',
    responses: {
      200: createSuccessRoute({
        resSchema: medRequest
      }),
      400: createFailRoute()
    }
  }),
  validator('query', medRequest),
  async (c) => {
    const query = c.req.valid('query')
    const res = await getMedChat(query.message)

    return c.text(res.message, undefined, {
      'X-CLARIFY-NEEDED': `${res.clarifyNeeded}`
    })
  }
)

// Zod 스키마 정의 - AI SDK 호환성을 위해 더 유연하게 구성
const messagePartSchema = z.object({
  type: z.union([
    z.literal('text'),
    z.literal('step-start'),
    z.literal('step-finish'),
    z.literal('tool-call'),
    z.literal('tool-result'),
    z.string() // 기타 미래의 타입들을 위한 fallback
  ]),
  text: z.string().optional(),
  // AI SDK에서 사용할 수 있는 추가 필드들
  toolCallId: z.string().optional(),
  toolName: z.string().optional(),
  result: z.any().optional(),
  delta: z.string().optional()
})

const messageRoleSchema = z.enum(['system', 'user', 'assistant'])

const messageSchema = z.object({
  role: messageRoleSchema,
  content: z.string(),
  parts: z.array(messagePartSchema).optional() // parts를 optional로 변경
})

// 스트리밍 요청/응답 스키마
export const medStreamRequest = z
  .object({
    id: z.string(),
    messages: z.array(messageSchema)
  })
  .openapi({
    example: {
      id: 'chat_123456789',
      messages: [
        {
          role: 'user',
          content: '혈압이 높은데 어떻게 관리해야 하나요?'
        }
      ]
    }
  })

medRouter.post(
  '/chat/stream',
  describeRoute({
    description: '의학적 질문에 스트리밍으로 답하는 post 메소드',
    responses: {
      200: createSuccessRoute({
        resSchema: medStreamRequest
      }),
      400: createFailRoute()
    }
  }),
  validator('json', medStreamRequest),
  async (c) => {
    try {
      const requestBody = c.req.valid('json')
      console.log(
        'Received request body:',
        JSON.stringify(requestBody, null, 2)
      )

      const { messages = [] } = requestBody
      const stream = await getMedChatStream(messages)

      return stream.toDataStreamResponse({
        headers: {
          'Content-Type': 'text/event-stream'
        }
      })
    } catch (error) {
      console.error('Error in medical chat route:', error)

      // Rate limit 에러 체크
      if (
        error instanceof Error &&
        error.message.includes('Too many requests')
      ) {
        return c.json(
          {
            error: '요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요.'
          },
          429
        )
      }

      return c.json(
        {
          error: '서버 내부 오류가 발생했습니다.'
        },
        500
      )
    }
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
