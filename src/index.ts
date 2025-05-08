import { swaggerUI } from '@hono/swagger-ui'
import { handle } from 'hono/aws-lambda'
import hospital from './routes/hospital/hospital'
import pharamacy from './routes/pharamacy/pharamacy'
import app from './app'
import { HospitalEntity } from './routes/hospital/entity'
import 'dotenv/config'
import PharmacyEntity from './routes/pharamacy/entity'

app.openapi(hospital, async (c) => {
  // const query = c.req.valid('query')

  // 페이징 파라미터 추출
  // const numOfRows = toNumber(query.numOfRows) || 10
  // // const pageNo = toNumber(query.pageNo) || 1
  // const limit = numOfRows

  const result = await HospitalEntity.scan.go({
    // 일렉트로 DB 의 오너쉽을 확인하지 않음(https://chatgpt.com/share/681c23f2-c538-8012-a6e2-e97940522a13)
    ignoreOwnership: true,
    limit: 1
  })

  return c.json({
    success: true,
    data: result.data
  })
})

app.openapi(pharamacy, async (c) => {
  // const query = c.req.valid('query')
  // 페이징 파라미터 추출
  // const numOfRows = toNumber(query.numOfRows) || 10
  // const pageNo = toNumber(query.pageNo) || 1
  // const limit = numOfRows
  const result = await PharmacyEntity.scan.go({
    ignoreOwnership: true,
    limit: 1
  })

  return c.json({
    success: true,
    data: result.data
  })
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
