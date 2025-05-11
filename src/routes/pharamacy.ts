import PharmacyEntity from '@/schemas/pharamacy/entity'
import {
  pharmacyPoiResSchema,
  pharmacyRequest,
  PharmacyPoiResSchema
} from '@/schemas/pharamacy/schema'
import { createFailRoute, createSuccessRoute } from '@/schemas/utility'
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
import { validator } from 'hono-openapi/zod'
import { toNumber } from 'lodash-es'
import { PharmacyPoiSchema } from 'sdk/api'

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
    const limit = toNumber(query.limit) || 10
    const data = await PharmacyEntity.scan
      .where(({ ADDR, INST_NM }, { contains }) => {
        const conditions = []

        if (query.ADDR) {
          // eslint-disable-next-line no-restricted-syntax
          conditions.push(contains(ADDR, query.ADDR))
        }

        if (query.INST_NM) {
          // eslint-disable-next-line no-restricted-syntax
          conditions.push(contains(INST_NM, query.INST_NM))
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
    const res: PharmacyPoiResSchema = {
      success: true,
      data: {
        list: data.data as unknown as PharmacyPoiSchema[],
        cursor: data.cursor
      }
    }

    return c.json(res)
  }
)

export default pharamacyRouter
