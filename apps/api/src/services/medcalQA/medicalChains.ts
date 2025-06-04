import { createRetrievalChain } from 'langchain/chains/retrieval'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { BedrockChat } from '@langchain/community/chat_models/bedrock'
import { BedrockEmbeddings } from '@langchain/aws'
import { credentials } from '../credentials'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import loadMarkdown from './loadMarkdown'

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
  ['system', loadMarkdown('src/services/medcalQA/prompts/clarify/system.md')],
  ['user', loadMarkdown('src/services/medcalQA/prompts/clarify/user.md')]
])
  .pipe(bedrockLLM)
  .pipe(parser)

// 사용자와의 대화를 요약해서 토큰을 절약하는 프롬프트 템플릿
export const summarizeChain = ChatPromptTemplate.fromMessages([
  ['system', loadMarkdown('src/services/medcalQA/prompts/summarize/system.md')],
  ['user', loadMarkdown('src/services/medcalQA/prompts/summarize/user.md')]
])
  .pipe(bedrockLLM)
  .pipe(parser)

export const getQAChain = async () => {
  // QA 체인을 위한 프롬프트 템플릿
  const qaPromptTemplate = ChatPromptTemplate.fromMessages([
    ['system', loadMarkdown('src/services/medcalQA/prompts/qa/system.md')],
    ['user', loadMarkdown('src/services/medcalQA/prompts/qa/user.md')]
  ])

  // Document 결합 체인 생성
  const combineDocsChain = await createStuffDocumentsChain({
    llm: bedrockLLM,
    prompt: qaPromptTemplate
  })

  // Bedrock Embeddings 설정
  const embeddings = new BedrockEmbeddings({
    region: 'ap-northeast-2',
    credentials,
    model: 'amazon.titan-embed-text-v1'
  })

  // 인메모리 벡터스토어
  const vectorStore = await MemoryVectorStore.fromTexts([], [], embeddings)

  // 최종 retrieval 체인 생성
  return createRetrievalChain({
    retriever: vectorStore.asRetriever(),
    combineDocsChain
  })
}
