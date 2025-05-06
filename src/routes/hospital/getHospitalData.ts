import { AttributeValue, ScanCommand } from '@aws-sdk/client-dynamodb'
import { docClient } from '../../client'

type Params = {
  TableName: string
  query: Record<string, unknown>
}

// DynamoDB에서 병원 정보 가져오기
const getHospitalData = async <T>({ TableName, query }: Params) => {
  try {
    // 검색 조건이 있는 경우 필터 생성
    const filterConditions = Object.entries(query || {}).filter(
      ([, value]) => value !== undefined && value !== null
    )

    // 검색 조건이 없으면 전체 데이터 가져오기
    if (filterConditions.length === 0) {
      const scanCommand = new ScanCommand({
        TableName
      })

      const scanResponse = await docClient.send(scanCommand)

      return scanResponse.Items || []
    }

    // 검색 조건이 있으면 해당 조건으로 필터링
    const filterExpressions = filterConditions.map(
      ([key]) => `contains(#${key}, :${key})`
    )
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, AttributeValue> = {}

    filterConditions.forEach(([key, value]) => {
      expressionAttributeNames[`#${key}`] = key
      expressionAttributeValues[`:${key}`] = value as AttributeValue
    })

    const command = new ScanCommand({
      TableName,
      FilterExpression: filterExpressions.join(' AND '),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    })

    const response = await docClient.send(command)

    return (response.Items || []) as T[]
  } catch (e) {
    if (e instanceof Error) {
      console.error('Error fetching hospital data:', e.message)
    }

    return []
  }
}

export default getHospitalData
