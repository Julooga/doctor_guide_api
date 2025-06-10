// import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock'
// import { fromNodeProviderChain } from '@aws-sdk/credential-providers'

// const bedrock = createAmazonBedrock({
//   region: 'ap-northeast-2',
//   credentialProvider: fromNodeProviderChain()
// })

// export default bedrock('anthropic.claude-3-5-sonnet-20240620-v1:0')

import { createAnthropic } from '@ai-sdk/anthropic'

const anthropic = createAnthropic({
  apiKey:
    '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'
})

export default anthropic('claude-3-haiku-20240307')
