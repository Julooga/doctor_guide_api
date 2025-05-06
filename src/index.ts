import { swaggerUI } from '@hono/swagger-ui'
import { handle } from 'hono/aws-lambda'
import hospital from './routes/hospital/hospital'
import pharamacy from './routes/pharamacy/pharamacy'
import app from './app'
import hospital_mock from './routes/hospital/hospital_mock'
import pharamacy_mock from './routes/pharamacy/pharamacy_mock'

app.openapi(hospital, (c) => {
  const query = c.req.valid('query')
  console.log(query)

  return c.json({
    success: true,
    data: hospital_mock
  })
})

app.openapi(pharamacy, (c) => {
  const query = c.req.valid('query')
  console.log(query)

  return c.json({
    success: true,
    data: pharamacy_mock
  })
})

app.doc31('/docs', {
  openapi: '3.1.0',
  info: {
    version: '1.0.0',
    title: 'Doctor Guide Api'
  },
  servers: [
    {
      url: 'http://localhost:8080'
    },
    {
      url: 'https://1acgaqfa8f.execute-api.ap-northeast-2.amazonaws.com'
    }
  ]
})
app.get('/', swaggerUI({ url: '/docs' }))

export const handler = handle(app)
export default app
