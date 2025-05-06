import { createRoute, z } from '@hono/zod-openapi'
import { createSuccessSchema } from './utils'

const reqSchema = z
  .object({
    userName: z.string().openapi({
      param: { name: '이름' },
      example: '홍길동',
      description: '사용자의 이름'
    })
  })
  .openapi('HospitalRequest')

const resSchema = z
  .object({
    greetings: z.string().openapi({
      example: '안녕하세요. *** 님',
      description: '인삿말'
    })
  })
  .openapi('HospitalResponse')

const route = createRoute({
  method: 'get',
  path: '/hospital',
  tags: ['병원정보'],
  description:
    '재난안전데이터 공유플랫폼이 제공하는 행정안전부 병의원 POI 목록을 반환하는 get 메소드',
  request: {
    body: {
      content: {
        'application/json': {
          schema: reqSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: createSuccessSchema({
            dataSchema: resSchema,
            schemaName: 'HospitalSuccessResponse'
          })
        }
      },
      description: '성공 응답'
    }
  }
})

export default route
