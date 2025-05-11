import { resolver } from 'hono-openapi/zod'
import { z, ZodType } from 'zod'
import 'zod-openapi/extend'

export const zodErrorSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  error: z.object({
    issues: z.array(
      z.object({
        code: z.string().openapi({ example: 'invalid_type' }),
        message: z.string().openapi({
          example: 'Expected number, received string'
        }),
        path: z.array(z.string()).openapi({ example: ['count'] })
      })
    ),
    name: z.string().openapi({ example: 'Error' })
  })
})

export const createFailRoute = (description = '에러응답') => {
  return {
    description,
    content: {
      'application/json': {
        schema: resolver(
          zodErrorSchema.openapi({
            ref: 'ErrorSchema'
          })
        )
      }
    }
  }
}

export const createSuccessSchema = (dataSchema: ZodType) => {
  return z.object({
    success: z.boolean(),
    data: dataSchema
  })
}

export const createSuccessRoute = ({
  description = '성공응답',
  resSchema
}: {
  description?: string
  resSchema: ZodType
}) => {
  return {
    description,
    content: {
      'application/json': {
        schema: resolver(resSchema)
      }
    }
  }
}

export const createNumberSchema = () => {
  return z.preprocess(
    (value) => {
      if (typeof value === 'string') {
        return parseInt(value, 10)
      }

      return value
    }, // 문자열을 숫자로 변환
    z.number()
  )
}
