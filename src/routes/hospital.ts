import HospitalEntity from '@/schemas/hospital/entity'
import {
  hospitalPoiResSchema,
  hospitalRequest,
  HospitalPoiResSchema
} from '@/schemas/hospital/schema'
import { createFailRoute, createSuccessRoute } from '@/schemas/utility'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { toNumber } from 'lodash-es'
import { HospitalPoiSchema } from 'sdk/api'

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
    const limit = toNumber(query.limit) || 10
    const data = await HospitalEntity.scan
      .where(({ ADDR, FIAI_MDLCR_INST_CD_NM }, { contains }) => {
        const conditions = []

        if (query.ADDR) {
          // eslint-disable-next-line no-restricted-syntax
          conditions.push(contains(ADDR, query.ADDR))
        }

        if (query.FIAI_MDLCR_INST_CD_NM) {
          // eslint-disable-next-line no-restricted-syntax
          conditions.push(
            contains(FIAI_MDLCR_INST_CD_NM, query.FIAI_MDLCR_INST_CD_NM)
          )
        }

        if (conditions.length > 0) {
          return conditions.join(' AND ')
        }

        return ''
      })
      .go({
        ignoreOwnership: true,
        limit,
        cursor: query.cursor
      })

    const res: HospitalPoiResSchema = {
      success: true,
      data: {
        list: data.data as unknown as HospitalPoiSchema[],
        cursor: data.cursor
      }
    }

    return c.json(res)
  }
)

export default hospitalRouter
