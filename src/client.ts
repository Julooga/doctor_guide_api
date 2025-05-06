import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

const remoteClient = new DynamoDBClient({
  region: 'ap-northeast-2'
})

// docker run -d -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb -cors '*' 명령으로 로컬 다이나모 실행가능
const localClient = new DynamoDBClient({
  region: 'local', // 또는 'ap-northeast-2'도 무방
  endpoint: 'http://localhost:8000', // DynamoDB Local 기본 주소
  credentials: {
    accessKeyId: 'dummy', // 아무 값이나 가능
    secretAccessKey: 'dummy' // 아무 값이나 가능
  }
})

const client = ({ local }: { local: boolean }) => {
  if (local) {
    return localClient
  }

  return remoteClient
}

export default client
