import { pharmacyPoiSchema } from '@/services/pharamacy/schema'
import {
  createFailRoute,
  createListDataSchema,
  createNumberSchema,
  createSuccessRoute,
  createSuccessSchema
} from '@/services/utility'
import getPharamacyPoiData from '@/services/pharamacy/getPharamacyPoiData'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { z } from 'zod'

export const pharmacyRequest = z.object({
  limit: createNumberSchema().optional().openapi({
    description: '페이지 당 레코드 개수',
    example: '10'
  }),
  cursor: z.string().optional().openapi({
    description: '다음 페이지를 조회하는 커서'
  }),
  ADDR: z.string().optional().openapi({
    description: '주소',
    example: '경기'
  }),
  INST_NM: z.string().optional().openapi({
    description: '약국이름',
    example: '역곡'
  })
})

export type PharmacyRequestType = z.infer<typeof pharmacyRequest>

export const pharmacyPoiResSchema = createSuccessSchema(
  createListDataSchema(pharmacyPoiSchema)
).openapi({ ref: 'PharamacyResponse' })

export type PharmacyPoiResSchemaType = z.infer<typeof pharmacyPoiResSchema>

const pharamacyRouter = new Hono()

pharamacyRouter.get(
  '/',
  describeRoute({
    description:
      '재난안전데이터 공유플랫폼이 제공하는 행정안전부 약국 POI 목록을 반환하는 get 메소드',
    responses: {
      200: createSuccessRoute({ resSchema: pharmacyPoiResSchema }),
      400: createFailRoute()
    }
  }),
  validator('query', pharmacyRequest),
  async (c) => {
    const query = c.req.valid('query')
    const data = await getPharamacyPoiData(query)
    const res: PharmacyPoiResSchemaType = {
      success: true,
      data
    }

    return c.json(res)
  }
)

export default pharamacyRouter
