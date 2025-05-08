import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'

const app = new Hono()
// const app = new OpenAPIHono({
//   defaultHook: (result, c) => {
//     if (!result.success) {
//       return c.json(
//         {
//           success: false,
//           error: result.error
//         },
//         400
//       )
//     }
//   }
// })

app.use('*', logger())

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

export default app
