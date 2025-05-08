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
  const data = await HospitalEntity.scan.go({
    // 일렉트로 DB 의 오너쉽을 확인하지 않음(https://chatgpt.com/share/681c23f2-c538-8012-a6e2-e97940522a13)
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
  const data = await PharmacyEntity.scan.go({
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
