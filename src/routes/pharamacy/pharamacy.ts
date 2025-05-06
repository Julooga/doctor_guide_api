import { createRoute, z } from '@hono/zod-openapi'
import { createSuccessSchema } from '../utils'
import { pharmacyPoiModel, pharmacyPoiReqSchema } from './schema'

const route = createRoute({
  method: 'get',
  path: '/pharamacy',
  tags: ['약국정보'],
  description:
    '재난안전데이터 공유플랫폼이 제공하는 행정안전부 약국 POI 목록을 반환하는 get 메소드',
  request: {
    query: pharmacyPoiReqSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: createSuccessSchema({
            dataSchema: z.array(pharmacyPoiModel),
            schemaName: 'PharamacySuccessResponse'
          })
        }
      },
      description: '성공 응답'
    }
  }
})

export default route
