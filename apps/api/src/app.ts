import { swaggerUI } from '@hono/swagger-ui'
import { Hono } from 'hono'
import { openAPISpecs } from 'hono-openapi'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { version } from '../../../package.json'

const app = new Hono()

app.use('*', logger())
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

app.get('/', swaggerUI({ url: '/docs' }))

app.get(
  '/docs',
  openAPISpecs(app, {
    documentation: {
      info: {
        version,
        title: 'Doctor Guide Api'
      },
      servers: [{
        url: 'https://rr5yxu11dl.execute-api.ap-northeast-2.amazonaws.com'
      }]
    }
  })
)

export default app
