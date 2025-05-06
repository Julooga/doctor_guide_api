import { z } from '@hono/zod-openapi'

export const createSuccessSchema = <T extends z.ZodTypeAny>({
  dataSchema,
  schemaName
}: {
  dataSchema: T
  schemaName: string
}) => {
  return z
    .object({
      success: z.boolean().openapi({
        example: true,
        description: '요청 처리 성공 여부'
      }),
      data: dataSchema
    })
    .openapi(schemaName)
}
