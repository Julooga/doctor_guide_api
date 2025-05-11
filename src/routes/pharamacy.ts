import {
  pharmacyPoiResSchema,
  pharmacyRequest,
  PharmacyPoiResSchemaType
} from '@/schemas/pharamacy/schema'
import { createFailRoute, createSuccessRoute } from '@/schemas/utility'
import getPharamacyPoiData from '@/services/getPharamacyPoiData'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'

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
