import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import { HospitalPoiReqSchema } from './schema'
import { docClient } from '../../client'
import {
  createFilterExpression,
  createScanParams,
  getLastEvaluatedKeyAddedScanParams,
  processScanResult
} from '../api'
import { toNumber } from 'lodash-es'
import 'dotenv/config'

type Params = {
  TableName: string
  query: HospitalPoiReqSchema
}

/**
 * DynamoDB에서 병원 정보 가져오기
 */
const getHospitalData = async <ResultRecord>({ TableName, query }: Params) => {
  const numOfRows = toNumber(query.numOfRows)
  const pageNo = toNumber(query.pageNo)
  const ADDR = query.ADDR

  const {
    filterExpression,
    expressionAttributeValues,
    expressionAttributeNames
  } = createFilterExpression({ ADDR })

  const params = createScanParams<ResultRecord>({
    TableName,
    Limit: numOfRows,
    filterExpression,
    expressionAttributeValues,
    expressionAttributeNames
  })

  // 페이징을 위한 LastEvaluatedKey 계산
  const newParams = await getLastEvaluatedKeyAddedScanParams<ResultRecord>({
    pageNo,
    params
  })

  // 최종 스캔 명령 실행
  const command = new ScanCommand(newParams as never)
  const response = await docClient.send(command)

  return processScanResult<ResultRecord>(response)
}

export default getHospitalData
