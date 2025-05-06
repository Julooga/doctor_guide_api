import { createRoute, z } from '@hono/zod-openapi'
import { createSuccessSchema } from './utils'

const reqSchema = z
  .object({
    userName: z.string().optional().openapi({
      example: '홍길동',
      description: '사용자의 이름'
    })
  })
  .openapi('PharamacyRequest')

const resSchema = z
  .object({
    greetings: z.string().openapi({
      example: '안녕하세요. *** 님',
      description: '인삿말'
    })
  })
  .openapi('PharamacyResponse')

const route = createRoute({
  method: 'get',
  path: '/pharamacy',
  tags: ['약국정보'],
  description:
    '재난안전데이터 공유플랫폼이 제공하는 행정안전부 약국 POI 목록을 반환하는 get 메소드',
  request: {
    query: reqSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: createSuccessSchema({
            dataSchema: resSchema,
            schemaName: 'PharamacySuccessResponse'
          })
        }
      },
      description: '성공 응답'
    }
  }
})

export default route
