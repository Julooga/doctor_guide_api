import { AgentExecutor, createToolCallingAgent } from 'langchain/agents'
import { BedrockChat } from '@langchain/community/chat_models/bedrock'
import { credentials } from '../credentials'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import loadMarkdown from './loadMarkdown'
import { hospitalSearchTool, pharmacySearchTool } from './tools'

const parser = new StringOutputParser()

// Bedrock LLM 설정 (Rate limiting 고려)
const bedrockLLM = new BedrockChat({
  region: 'ap-northeast-2',
  credentials,
  model: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
  maxRetries: 3,
  maxConcurrency: 1,
  temperature: 0.1
})

export const clarifyChain = ChatPromptTemplate.fromMessages([
  ['system', loadMarkdown('./prompts/clarify/system.md')],
  ['user', loadMarkdown('./prompts/clarify/user.md')]
])
  .pipe(bedrockLLM)
  .pipe(parser)

// 사용자와의 대화를 요약해서 토큰을 절약하는 프롬프트 템플릿
export const summarizeChain = ChatPromptTemplate.fromMessages([
  ['system', loadMarkdown('./prompts/summarize/system.md')],
  ['user', loadMarkdown('./prompts/summarize/user.md')]
])
  .pipe(bedrockLLM)
  .pipe(parser)

export const getQAChain = async () => {
  const tools = [hospitalSearchTool, pharmacySearchTool]

  // Tool을 사용할 수 있는 프롬프트 템플릿
  const qaPromptTemplate = ChatPromptTemplate.fromMessages([
    ['system', loadMarkdown('./prompts/qa/system.md')],
    ['placeholder', '{chat_history}'],
    ['human', '{input}'],
    ['placeholder', '{agent_scratchpad}']
  ])

  // Tool-calling agent 생성
  const agent = await createToolCallingAgent({
    llm: bedrockLLM,
    tools,
    prompt: qaPromptTemplate
  })

  // AgentExecutor 반환 (기존 retrieval chain과 동일한 인터페이스)
  return new AgentExecutor({
    agent,
    tools,
    verbose: true,
    maxIterations: 3
  })
}
