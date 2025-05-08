import { createRoute } from '@hono/zod-openapi'
import { hospitalPoiReqSchema, hospitalPoiResSchema } from './schema'

const route = createRoute({
  method: 'get',
  path: '/hospital',
  tags: ['병원정보'],
  description:
    '재난안전데이터 공유플랫폼이 제공하는 행정안전부 병의원 POI 목록을 반환하는 get 메소드',
  request: {
    query: hospitalPoiReqSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: hospitalPoiResSchema
        }
      },
      description: '성공 응답'
    }
  }
})

export default route
