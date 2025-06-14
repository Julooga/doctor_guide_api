import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'

const bedrock = createAmazonBedrock({
  region: 'ap-northeast-2',
  credentialProvider: fromNodeProviderChain()
})

export default bedrock('anthropic.claude-3-5-sonnet-20240620-v1:0')

// import { createAnthropic } from '@ai-sdk/anthropic'

// // Anthropic API 키가 필요합니다 (환경변수에 ANTHROPIC_API_KEY 설정)
// export default createAnthropic({
//   apiKey: ''
// })
