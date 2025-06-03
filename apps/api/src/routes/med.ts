import { createSuccessRoute, createFailRoute } from '@/services/utility'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { HospitalPoiResponse } from './hospital'
import { validator } from 'hono-openapi/zod'
import { z } from 'zod'
import { getMedChat } from '@/services/med/getMedChat'

export const medRequest = z.object({
  message: z.string()
})

const medRouter = new Hono()

medRouter.post(
  '/',
  describeRoute({
    description: '의학적 질문에 답하는 get 메소드',
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
    const data = await getMedChat(query)
    const res: HospitalPoiResponse = {
      success: true,
      data
    }

    return c.json(res)
  }
)

export default medRouter
