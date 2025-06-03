// import {
//   BedrockRuntimeClient,
//   InvokeModelCommand
// } from '@aws-sdk/client-bedrock-runtime'

// type MedicalAIRequest = {
//   prompt: string
//   maxTokens?: number
//   temperature?: number
// }

// type MedicalAIResponse = {
//   response: string
//   usage: {
//     inputTokens: number
//     outputTokens: number
//   }
// }

// export class MedicalAIService {
//   private client: BedrockRuntimeClient
//   private modelId: string
//   private defaultMaxTokens: number
//   private defaultTemperature: number

//   constructor() {
//     this.client = new BedrockRuntimeClient({
//       region: process.env.AWS_BEDROCK_REGION || 'us-west-2'
//     })
//     // MedGemma 대신 Claude 3 Haiku 사용 (AWS Bedrock에서 지원)
//     this.modelId =
//       process.env.MEDGEMMA_MODEL_ID || 'anthropic.claude-3-haiku-20240307-v1:0'
//     this.defaultMaxTokens = parseInt(process.env.BEDROCK_MAX_TOKENS || '4096')
//     this.defaultTemperature = parseFloat(
//       process.env.BEDROCK_TEMPERATURE || '0.1'
//     )
//   }

//   async invokeMedicalAI({
//     prompt,
//     maxTokens,
//     temperature
//   }: MedicalAIRequest): Promise<MedicalAIResponse> {
//     try {
//       const requestBody = this.buildRequestBody(prompt, maxTokens, temperature)

//       const command = new InvokeModelCommand({
//         modelId: this.modelId,
//         body: JSON.stringify(requestBody),
//         contentType: 'application/json',
//         accept: 'application/json'
//       })

//       const response = await this.client.send(command)

//       if (!response.body) {
//         throw new Error('Empty response from Bedrock')
//       }

//       const responseBody = JSON.parse(new TextDecoder().decode(response.body))

//       return this.parseResponse(responseBody)
//     } catch (error) {
//       console.error('Medical AI invocation error:', error)
//       throw new Error('Failed to invoke Medical AI model')
//     }
//   }

//   private buildRequestBody(
//     prompt: string,
//     maxTokens?: number,
//     temperature?: number
//   ) {
//     if (this.modelId.includes('claude')) {
//       // Claude 3 요청 형식
//       return {
//         anthropic_version: 'bedrock-2023-05-31',
//         messages: [{ role: 'user', content: prompt }],
//         max_tokens: maxTokens || this.defaultMaxTokens,
//         temperature: temperature || this.defaultTemperature,
//         top_p: 0.95
//       }
//     } else {
//       // 기타 모델 (Gemma 등) 요청 형식
//       return {
//         prompt,
//         max_tokens: maxTokens || this.defaultMaxTokens,
//         temperature: temperature || this.defaultTemperature,
//         top_p: 0.95,
//         stop_sequences: ['Human:', 'Assistant:']
//       }
//     }
//   }

//   private parseResponse(responseBody: Record<string, any>): MedicalAIResponse {
//     if (this.modelId.includes('claude')) {
//       // Claude 3 응답 형식
//       return {
//         response: responseBody.content?.[0]?.text || '',
//         usage: {
//           inputTokens: responseBody.usage?.input_tokens || 0,
//           outputTokens: responseBody.usage?.output_tokens || 0
//         }
//       }
//     } else {
//       // 기타 모델 응답 형식
//       return {
//         response: responseBody.completion || responseBody.generated_text || '',
//         usage: {
//           inputTokens: responseBody.usage?.input_tokens || 0,
//           outputTokens: responseBody.usage?.output_tokens || 0
//         }
//       }
//     }
//   }

//   // 의료진을 위한 특화된 프롬프트 템플릿
//   createMedicalPrompt(userInput: string, context?: string): string {
//     const systemPrompt = `
// You are MedGemma, a specialized medical AI assistant trained to help healthcare professionals.
// Please provide accurate, evidence-based medical information while emphasizing the importance of proper medical consultation.

// Important guidelines:
// - Always recommend consulting with qualified healthcare professionals
// - Provide general medical information based on current evidence
// - Do not provide specific diagnoses or treatment recommendations
// - Acknowledge limitations and uncertainties
// - Use clear, professional language
//     `.trim()

//     const contextSection = context ? `\n\nContext: ${context}` : ''

//     return `${systemPrompt}${contextSection}\n\nHuman: ${userInput}\n\nAssistant:`
//   }

//   // 진단 보조를 위한 구조화된 프롬프트
//   createDiagnosisAssistPrompt(
//     symptoms: string[],
//     patientHistory?: string
//   ): string {
//     const systemPrompt = `
// You are MedGemma, providing diagnostic assistance to healthcare professionals.
// Analyze the presented symptoms and suggest possible differential diagnoses with evidence-based reasoning.

// Guidelines:
// - List possible diagnoses in order of likelihood
// - Explain reasoning for each diagnosis
// - Suggest additional tests or examinations that might be helpful
// - Emphasize the need for clinical correlation and professional judgment
// - Include relevant red flags or urgent considerations
//     `.trim()

//     const symptomsText = symptoms.join(', ')

//     const historySection = patientHistory
//       ? `\n\nPatient History: ${patientHistory}`
//       : ''

//     return `${systemPrompt}\n\nSymptoms: ${symptomsText}${historySection}\n\nPlease provide diagnostic assistance:\n\nAssistant:`
//   }
// }
