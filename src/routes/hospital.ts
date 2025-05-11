import {
  hospitalPoiResSchema,
  hospitalRequest,
  HospitalPoiResSchemaType
} from '@/schemas/hospital/schema'
import { createFailRoute, createSuccessRoute } from '@/schemas/utility'
import getHospitalPoiData from '@/services/getHospitalPoiData'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'

const hospitalRouter = new Hono()

hospitalRouter.get(
  '/',
  describeRoute({
    description:
      '재난안전데이터 공유플랫폼이 제공하는 행정안전부 병의원 POI 목록을 반환하는 get 메소드',
    responses: {
      200: createSuccessRoute({
        resSchema: hospitalPoiResSchema
      }),
      400: createFailRoute()
    }
  }),
  validator('query', hospitalRequest),
  async (c) => {
    const query = c.req.valid('query')
    const data = await getHospitalPoiData(query)
    const res: HospitalPoiResSchemaType = {
      success: true,
      data
    }

    return c.json(res)
  }
)

export default hospitalRouter
