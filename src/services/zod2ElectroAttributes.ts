import {
  ZodTypeAny,
  ZodObject,
  ZodDefault,
  ZodEnum,
  ZodLiteral,
  ZodOptional,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodRawShape
} from 'zod'

// 각 필드의 속성을 정의하는 타입
type ElectroAttributeConfig = {
  type: string
  required: boolean
  default?: unknown
  value?: unknown
  enum?: readonly [string, ...string[]]
  regex?: RegExp
}

// Zod 타입 처리 함수들
type SchemaWithConfig = {
  schema: ZodTypeAny
  config: Partial<ElectroAttributeConfig>
}

const processOptional = (
  schema: ZodTypeAny,
  config: Partial<ElectroAttributeConfig>
): SchemaWithConfig => {
  if (schema instanceof ZodOptional) {
    return {
      schema: schema._def.innerType,
      config: { ...config, required: false }
    }
  }

  return {
    schema,
    config: { ...config, required: true }
  }
}

const processDefault = (
  schema: ZodTypeAny,
  config: Partial<ElectroAttributeConfig>
): SchemaWithConfig => {
  if (schema instanceof ZodDefault) {
    return {
      schema: schema._def.innerType,
      config: { ...config, default: schema._def.defaultValue() }
    }
  }

  return { schema, config }
}

const processLiteral = (schema: ZodTypeAny): ElectroAttributeConfig | null => {
  if (schema instanceof ZodLiteral) {
    return {
      type: typeof schema._def.value,
      value: schema._def.value,
      required: true
    }
  }

  return null
}

const processEnum = (schema: ZodTypeAny): ElectroAttributeConfig | null => {
  if (schema instanceof ZodEnum) {
    return {
      type: 'string',
      enum: schema._def.values,
      required: true
    }
  }

  return null
}

type RegexCheck = {
  kind: string
  regex: RegExp
}

const extractRegexFromChecks = (checks: unknown[]): RegExp | undefined => {
  const regexCheck = checks?.find(
    (c): c is RegexCheck => (c as RegexCheck)?.kind === 'regex'
  )

  return regexCheck?.regex
}

const processString = (
  schema: ZodTypeAny,
  config: Partial<ElectroAttributeConfig>
): ElectroAttributeConfig | null => {
  if (!(schema instanceof ZodString)) {
    return null
  }

  return {
    ...config,
    type: 'string',
    required: config.required ?? true,
    ...(schema._def.checks && {
      regex: extractRegexFromChecks(schema._def.checks)
    })
  }
}

const processNumber = (
  schema: ZodTypeAny,
  config: Partial<ElectroAttributeConfig>
): ElectroAttributeConfig | null => {
  if (!(schema instanceof ZodNumber)) {
    return null
  }

  return {
    ...config,
    type: 'number',
    required: config.required ?? true
  }
}

const processBoolean = (
  schema: ZodTypeAny,
  config: Partial<ElectroAttributeConfig>
): ElectroAttributeConfig | null => {
  if (!(schema instanceof ZodBoolean)) {
    return null
  }

  return {
    ...config,
    type: 'boolean',
    required: config.required ?? true
  }
}

const processType = (
  schema: ZodTypeAny,
  config: Partial<ElectroAttributeConfig>,
  key: string
): ElectroAttributeConfig => {
  // 타입별 처리 함수들 순차적으로 시도
  const typeProcessors = [processString, processNumber, processBoolean]

  // 첫 번째로 null이 아닌 결과를 반환
  const result = typeProcessors
    .map((processor) => processor(schema, config))
    .find((item) => item !== null)

  if (result) return result

  // 지원하지 않는 타입인 경우 에러
  throw new Error(`지원하지 않는 Zod 타입: "${key}"`)
}

const processSchema = (
  key: string,
  rawSchema: ZodTypeAny
): ElectroAttributeConfig => {
  // Optional 처리
  const { schema: schemaAfterOptional, config: configAfterOptional } =
    processOptional(rawSchema, {})

  // Default 값 처리
  const { schema: schemaAfterDefault, config: configAfterDefault } =
    processDefault(schemaAfterOptional, configAfterOptional)

  // Literal 타입 처리
  const literalConfig = processLiteral(schemaAfterDefault)

  if (literalConfig) return literalConfig

  // Enum 타입 처리
  const enumConfig = processEnum(schemaAfterDefault)

  if (enumConfig) return enumConfig

  // 기본 타입들 처리 (String, Number, Boolean)
  return processType(schemaAfterDefault, configAfterDefault, key)
}

// zod 스키마를 일렉트로DB 애뜨리뷰트로 변환하는 컨버터 시제품
const zod2ElectroAttributes = <T extends ZodRawShape>(
  zodSchema: ZodObject<T>
): Record<string, ElectroAttributeConfig> => {
  const entries = Object.entries(zodSchema.shape).map(([key, schema]) => [
    key,
    processSchema(key, schema as ZodTypeAny)
  ])

  return Object.fromEntries(entries)
}

export default zod2ElectroAttributes
