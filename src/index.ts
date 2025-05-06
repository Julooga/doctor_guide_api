import { swaggerUI } from '@hono/swagger-ui'
import { handle } from 'hono/aws-lambda'
import hospital from './routes/hospital/hospital'
import pharamacy from './routes/pharamacy/pharamacy'
import app from './app'
import hospital_mock from './routes/hospital/hospital_mock'
import pharamacy_mock from './routes/pharamacy/pharamacy_mock'
import client from './client'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const docClient = DynamoDBDocumentClient.from(client({ local: false }))
console.log(docClient)

app.openapi(hospital, (c) => {
  const query = c.req.valid('query')
  console.log(query)
  // TODO: DynamoDBDocumentClient 타입 docClient 로 전체 컬렉션을 가져오는 코드를 추가. 모든 필드로 검색이 가능해야 한다.

  return c.json({
    success: true,
    data: hospital_mock
  })
})

app.openapi(pharamacy, (c) => {
  const query = c.req.valid('query')
  console.log(query)
  // TODO: DynamoDBDocumentClient 타입 docClient 로 전체 컬렉션을 가져오는 코드를 추가. 모든 필드로 검색이 가능해야 한다.

  return c.json({
    success: true,
    data: pharamacy_mock
  })
})

// const getServers = () => {
//   const localServer = {
//     url: 'http://localhost:8080'
//   }
//   const prodServer = {
//     url: 'https://1acgaqfa8f.execute-api.ap-northeast-2.amazonaws.com'
//   }
//   const isProduction =
//     process.env.LAMBDA_TASK_ROOT || process.env.NODE_ENV === 'production'

//   if (isProduction) {
//     return [prodServer]
//   }

//   return [localServer]
// }

app.doc31('/docs', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Doctor Guide Api'
  }
  // servers: getServers()
})
app.get('/', swaggerUI({ url: '/docs' }))

export const handler = handle(app)
export default app
