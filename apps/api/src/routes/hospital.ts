import hospitalPoiSchema from '@/services/hospital/hospitalPoiSchema'
import {
  createFailRoute,
  createListDataSchema,
  createNumberSchema,
  createSuccessRoute,
  createSuccessSchema
} from '@/services/utility'
import getHospitalPoiData from '@/services/hospital/getHospitalPoiData'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { z } from 'zod'

export const hospitalRequest = z.object({
  limit: createNumberSchema().optional().openapi({
    description: '페이지 당 레코드 개수',
    example: '10'
  }),
  cursor: z.string().optional().openapi({
    description: '다음 페이지를 조회하는 커서'
  }),
  ADDR: z.string().optional().openapi({
    description: '주소',
    example: '서울'
  }),
  FIAI_MDLCR_INST_CD_NM: z.string().optional().openapi({
    description: '응급의료기관코드명',
    example: '응급'
  })
})

export type HospitalRequest = z.infer<typeof hospitalRequest>

export type HospitalPoiType = z.infer<typeof hospitalPoiSchema>

export const hospitalPoiDataSchema = createListDataSchema(hospitalPoiSchema)
export type HospitalPoiDataType = z.infer<typeof hospitalPoiDataSchema>

export const hospitalPoiResSchema = createSuccessSchema(
  hospitalPoiDataSchema
).openapi({ ref: 'HospitalResponse' })

export type HospitalPoiResponse = z.infer<typeof hospitalPoiResSchema>

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
    const res: HospitalPoiResponse = {
      success: true,
      data
    }

    return c.json(res)
  }
)

export default hospitalRouter
