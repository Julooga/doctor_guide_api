import { createAnthropic } from '@ai-sdk/anthropic'

// Anthropic API 키가 필요합니다 (환경변수에 ANTHROPIC_API_KEY 설정)
export default createAnthropic({
  apiKey:
    process.env.ANTHROPIC_API_KEY ||
    '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'
})
