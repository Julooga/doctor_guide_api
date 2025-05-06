import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { handle } from 'hono/aws-lambda'
import hospital from './routes/hospital'

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: result.error
        },
        400
      )
    }
  }
})

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // HTTP 예외를 Zod 스타일로 변환
    return c.json(
      {
        success: false,
        error: {
          name: 'HTTPException',
          issues: [
            {
              code: `HTTP_${err.status}`,
              path: [],
              message: err.message || `HTTP ${err.status} 에러가 발생했습니다.`
            }
          ]
        }
      },
      err.status
    )
  }

  console.error('Unhandled error:', err)

  return c.json(
    {
      success: false,
      error: {
        name: 'InternalServerError', // 에러 종류 식별자
        issues: [
          {
            code: 'INTERNAL_SERVER_ERROR',
            path: [],
            message: '예상치 못한 서버 오류가 발생했습니다.'
          }
        ]
      }
    },
    500
  )
})

app.openapi(hospital, (c) => {
  const { userName } = c.req.valid('json')

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
