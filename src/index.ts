import { swaggerUI } from '@hono/swagger-ui'
import { handle } from 'hono/aws-lambda'
import hospital from './routes/hospital/hospital'
import pharamacy from './routes/pharamacy/pharamacy'
import app from './app'

app.openapi(hospital, (c) => {
  const { userName } = c.req.valid('query')

  return c.json({
    success: true,
    data: {
      greetings: `안녕하세요, ${userName}님`
    }
  })
})

app.openapi(pharamacy, (c) => {
  const { userName } = c.req.valid('query')

  return c.json({
    success: true,
    data: {
      greetings: `안녕하세요, ${userName}님`
    }
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
