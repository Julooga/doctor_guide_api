import { ScanCommand, ScanCommandOutput } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../client'
import { z } from '@hono/zod-openapi'

export type FilterParams = {
  ADDR?: string
}

// Record<string, any>를 제네릭 타입으로 대체
// export type DynamoDBItem<T = unknown> = Record<string, T>

export type ScanParams<ResultRecord> = {
  TableName: string
  Limit: number
  ExpressionAttributeNames?: Record<string, string>
  ExpressionAttributeValues?: Record<string, unknown>
  FilterExpression?: string
  ExclusiveStartKey?: ResultRecord
}

export const getScanResultSchema = <ResultRecord>() => {
  return z.object({
    items: z.custom<ResultRecord>().array(),
    totalCount: z.number(),
    lastEvaluatedKey: z.custom<ResultRecord>().optional(),
    hasNextPage: z.boolean()
  })
}

// export type ScanResult<ResultRecord> = {
//   items: Array<ResultRecord>
//   totalCount: number
//   lastEvaluatedKey?: ResultRecord
//   hasNextPage: boolean
// }

type FilterExpressionResult = {
  filterExpression: string
  expressionAttributeValues: Record<string, unknown>
  expressionAttributeNames: Record<string, string>
}

/**
 * 주소 필터 표현식 생성하는 순수 함수
 */
const createAddrFilter = (ADDR: string): FilterExpressionResult => ({
  filterExpression: 'contains(#addr, :addr)',
  expressionAttributeValues: { ':addr': ADDR },
  expressionAttributeNames: { '#addr': 'ADDR' }
})

/**
 * 빈 필터 표현식 생성하는 순수 함수
 */
const createEmptyFilter = (): FilterExpressionResult => ({
  filterExpression: '',
  expressionAttributeValues: {},
  expressionAttributeNames: {}
})

/**
 * 필터 표현식과 속성값을 생성하는 순수 함수
 */
export const createFilterExpression = ({
  ADDR
}: FilterParams): FilterExpressionResult => {
  if (!ADDR) {
    return createEmptyFilter()
  }

  return createAddrFilter(ADDR)
}

/**
 * 스캔 파라미터를 구성하는 순수 함수
 */
export const createScanParams = <ResultRecord>({
  TableName,
  Limit,
  filterExpression,
  expressionAttributeValues,
  expressionAttributeNames,
  ExclusiveStartKey
}: {
  TableName: string
  Limit: number
  filterExpression: string
  expressionAttributeValues: Record<string, unknown>
  expressionAttributeNames: Record<string, string>
  ExclusiveStartKey?: ResultRecord
}): ScanParams<ResultRecord> => {
  const params: ScanParams<ResultRecord> = {
    TableName,
    Limit
  }

  if (filterExpression) {
    // eslint-disable-next-line no-restricted-syntax
    params.FilterExpression = filterExpression
  }

  if (Object.keys(expressionAttributeValues).length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    params.ExpressionAttributeValues = expressionAttributeValues
  }

  if (Object.keys(expressionAttributeNames).length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    params.ExpressionAttributeNames = expressionAttributeNames
  }

  if (ExclusiveStartKey) {
    // eslint-disable-next-line no-restricted-syntax
    params.ExclusiveStartKey = ExclusiveStartKey
  }

  return params
}

/**
 * 페이지 조회를 위한 재귀 함수
 */
const getNextPage = async <ResultRecord>(
  params: ScanParams<ResultRecord>,
  currentPage: number,
  targetPage: number
): Promise<ResultRecord | undefined> => {
  if (currentPage >= targetPage) {
    return undefined
  }

  const tempResponse = await docClient.send(new ScanCommand(params as never))
  const lastEvaluatedKey = tempResponse.LastEvaluatedKey

  if (!lastEvaluatedKey) {
    return undefined
  }

  const nextParams = {
    ...params,
    ExclusiveStartKey: lastEvaluatedKey
  }

  return getNextPage<ResultRecord>(
    nextParams as never,
    currentPage + 1,
    targetPage
  )
}

/**
 * 페이지 탐색을 통해 LastEvaluatedKey를 찾는 순수 함수
 */
export const findLastEvaluatedKey = async <ResultRecord>({
  params,
  targetPage
}: {
  params: ScanParams<ResultRecord>
  targetPage: number
}): Promise<ResultRecord | undefined> => {
  if (targetPage <= 1) {
    return undefined
  }

  return getNextPage({ ...params }, 1, targetPage)
}

// 페이징을 위한 LastEvaluatedKey 계산
export const getLastEvaluatedKeyAddedScanParams = async <ResultRecord>({
  pageNo,
  params
}: {
  pageNo: number
  params: ScanParams<ResultRecord>
}) => {
  if (pageNo > 1) {
    const lastEvaluatedKey = await findLastEvaluatedKey({
      params,
      targetPage: pageNo
    })

    if (lastEvaluatedKey) {
      return {
        ...params,
        ExclusiveStartKey: lastEvaluatedKey
      }
    }
  }

  return params
}

/**
 * DynamoDB 스캔 결과 타입
 */
export type DynamoDBScanResponse<ResultRecord> = {
  Items?: Array<ResultRecord>
  Count?: number
  LastEvaluatedKey?: ResultRecord
}

/**
 * DynamoDB 스캔 결과를 가공하는 순수 함수
 */
export const processScanResult = <ResultRecord>(
  response: ScanCommandOutput
) => {
  return {
    items: (response.Items || []) as ResultRecord[],
    totalCount: response.Count || 0,
    lastEvaluatedKey: response.LastEvaluatedKey,
    hasNextPage: !!response.LastEvaluatedKey
  }
}
