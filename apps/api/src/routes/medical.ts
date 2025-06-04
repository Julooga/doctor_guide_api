import { createSuccessRoute, createFailRoute } from '@/services/utility'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { z } from 'zod'
import { getMedChat } from '@/services/medcalQA/getMedChat'
import { getMedChatSummary } from '@/services/medcalQA/getMedChatSummary'

export const medRequest = z.object({
  message: z.string()
  // conversations: z.string().array()
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
    const res = await getMedChat({ message: query.message, conversations: [] })

    return c.text(res.message, undefined, {
      'X-CLARIFY-NEEDED': `${res.clarifyNeeded}`
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
