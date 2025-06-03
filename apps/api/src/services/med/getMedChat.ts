import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  type InvokeModelCommandInput
} from '@aws-sdk/client-bedrock-runtime'

// Bedrock 클라이언트 초기화
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_BEDROCK_REGION ?? 'ap-northeast-2'
})

// Claude 모델 설정
const MODEL_ID = process.env.BEDROCK_MODEL_ID ?? 'anthropic.claude-3-haiku-20240307-v1:0'
const MAX_TOKENS = Number(process.env.BEDROCK_MAX_TOKENS) || 4096
const TEMPERATURE = Number(process.env.BEDROCK_TEMPERATURE) || 0.1

type GetMedChatParams = {
  message: string
}

/**
 * AWS Bedrock Claude 모델을 사용하여 의료 관련 채팅 응답을 생성합니다.
 * @param params - 입력 메시지 객체
 * @returns Claude 모델의 응답 메시지
 */
export const getMedChat = async ({ message }: GetMedChatParams): Promise<string> => {
  try {
    // Claude 모델용 요청 페이로드 구성
    const requestBody = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    }

    const input: InvokeModelCommandInput = {
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(requestBody)
    }

    // Bedrock 모델 호출
    const command = new InvokeModelCommand(input)
    const response = await bedrockClient.send(command)

    // 응답 파싱
    if (!response.body) {
      throw new Error('Bedrock 응답에서 body가 없습니다.')
    }

    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    
    // Claude 응답 구조에서 텍스트 추출
    if (responseBody.content && responseBody.content[0]?.text) {
      return responseBody.content[0].text
    }

    throw new Error('Bedrock 응답 형식이 예상과 다릅니다.')
  } catch (error) {
    // 타입 가드를 사용한 에러 처리
    if (error instanceof Error) {
      console.error('getMedChat 오류:', error.message)
      throw new Error(`의료 채팅 서비스 오류: ${error.message}`)
    }
    
    console.error('getMedChat 알 수 없는 오류:', error)
    throw new Error('의료 채팅 서비스에서 알 수 없는 오류가 발생했습니다.')
  }
}