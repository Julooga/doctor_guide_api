import { swaggerUI } from '@hono/swagger-ui'
import { handle } from 'hono/aws-lambda'
import hospital from './routes/hospital/hospital'
import pharamacy from './routes/pharamacy/pharamacy'
import app from './app'
import HospitalEntity from './routes/hospital/entity'
import 'dotenv/config'
import PharmacyEntity from './routes/pharamacy/entity'
import toNumber from 'lodash-es/toNumber'
import {
  PharmacyPoiResSchema,
  PharmacyPoiSchema
} from './routes/pharamacy/schema'
import {
  HospitalPoiResSchema,
  HospitalPoiSchema
} from './routes/hospital/schema'

app.openapi(hospital, async (c) => {
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
})

app.openapi(pharamacy, async (c) => {
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
})

app.doc31('/docs', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Doctor Guide Api'
  }
})

app.get('/', swaggerUI({ url: '/docs' }))

export const handler = handle(app)
export default app
