import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', logger())
app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['X-CLARIFY-NEEDED'],
    credentials: false
  })
)
app.use(secureHeaders())

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
        name: 'InternalServerError',
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

export default app
