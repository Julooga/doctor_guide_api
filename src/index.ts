import { handle } from 'hono/aws-lambda'
import app from './app'
import HospitalEntity from './routes/hospital/entity'
import 'dotenv/config'
import toNumber from 'lodash-es/toNumber'

import {
  HospitalRequest,
  hospitalPoiResSchema,
  HospitalPoiResSchema,
  HospitalPoiSchema
} from './routes/hospital/schema'
import { describeRoute, openAPISpecs } from 'hono-openapi'
import { resolver, validator as zValidator } from 'hono-openapi/zod'
import 'zod-openapi/extend'
import { swaggerUI } from '@hono/swagger-ui'
import {
  PharmacyRequest,
  pharmacyPoiResSchema,
  PharmacyPoiResSchema,
  PharmacyPoiSchema
} from './routes/pharamacy/schema'
import PharmacyEntity from './routes/pharamacy/entity'

app.get(
  '/hospital',
  describeRoute({
    description:
      '재난안전데이터 공유플랫폼이 제공하는 행정안전부 병의원 POI 목록을 반환하는 get 메소드',
    responses: {
      200: {
        description: '성공 응답',
        content: {
          'application/json': {
            schema: resolver(hospitalPoiResSchema)
          }
        }
      }
    }
  }),
  zValidator('query', HospitalRequest),
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
        items: data.data as unknown as HospitalPoiSchema[],
        cursor: data.cursor
      }
    }

    return c.json(res)
  }
)

app.get(
  '/pharamacy',
  describeRoute({
    description:
      '재난안전데이터 공유플랫폼이 제공하는 행정안전부 약국 POI 목록을 반환하는 get 메소드',
    responses: {
      200: {
        description: '성공 응답',
        content: {
          'application/json': {
            schema: resolver(pharmacyPoiResSchema)
          }
        }
      }
    }
  }),
  zValidator('query', PharmacyRequest),
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
        items: data.data as unknown as PharmacyPoiSchema[],
        cursor: data.cursor
      }
    }

    return c.json(res)
  }
)

app.get('/', swaggerUI({ url: '/docs' }))

app.get(
  '/docs',
  openAPISpecs(app, {
    documentation: {
      info: {
        version: '1.0.0',
        title: 'Doctor Guide Api'
      }
    }
  })
)

export const handler = handle(app)
export default app
