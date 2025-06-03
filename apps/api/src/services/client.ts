import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { fromIni } from '@aws-sdk/credential-providers'

type ClientParams = { local: boolean }

const getRemoteClient = () => {
  // 배포환경에서는 기본 자격증명 체인 사용 (IAM Role 등)
  return new DynamoDBClient({
    region: 'ap-northeast-2'
  })
}

const getAwsRemoteClient = () => {
  // 로컬에서 실제 AWS DynamoDB에 연결하고 싶을 때 사용
  return new DynamoDBClient({
    region: 'ap-northeast-2',
    credentials: fromIni({ profile: process.env.AWS_PROFILE })
  })
}

export const client = ({ local }: ClientParams) => {
  if (local) {
    return getAwsRemoteClient()
  }
  return getRemoteClient()
}

// PROFILE 환경변수에 따라 로컬/원격 클라이언트 결정
const isLocalEnvironment = process.env.PROFILE === 'local'
export const docClient = DynamoDBDocumentClient.from(client({ local: isLocalEnvironment }))
