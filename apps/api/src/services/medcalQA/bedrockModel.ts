import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock'
import { fromNodeProviderChain } from '@aws-sdk/credential-providers'

const bedrock = createAmazonBedrock({
  region: 'ap-northeast-2',
  credentialProvider: fromNodeProviderChain()
})

export default bedrock('anthropic.claude-3-5-sonnet-20240620-v1:0')
