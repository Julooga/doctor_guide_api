import * as aws from '@pulumi/aws'

// Bedrock 관련 설정 타입 정의
type BedrockModelConfig = {
  modelId: string
  region: string
  maxTokens: number
  temperature: number
}

// MedGemma 모델 설정
// 주의: 현재 AWS Bedrock에서 Google Gemma/MedGemma 모델은 공식적으로 지원되지 않습니다.
// 대안책:
// 1. Anthropic Claude (의료 분야에 강함) - bedrock에서 지원
// 2. Meta Llama 2/3 (의료 fine-tuning 가능) - bedrock에서 지원
// 3. 직접 Google AI Studio API 사용
// 4. SageMaker에서 MedGemma 직접 배포
export const claudeConfig: BedrockModelConfig = {
  // 임시로 Claude 3 Haiku 사용 (의료 분야 성능 좋음)
  modelId: 'anthropic.claude-3-haiku-20240307-v1:0', // MedGemma 대신 Claude 사용
  region: 'ap-northeast-2', // Claude는 여러 리전에서 지원
  maxTokens: 4096,
  temperature: 0.1 // 의료 데이터의 경우 낮은 온도 권장
}

// Bedrock Model Access IAM Policy
export const bedrockModelAccessPolicy = new aws.iam.Policy(
  'bedrockModelAccessPolicy',
  {
    name: 'bedrock-claude-access-policy',
    description: 'Policy for accessing AWS Bedrock claude model',
    policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'bedrock:InvokeModel',
            'bedrock:InvokeModelWithResponseStream',
            'bedrock:GetFoundationModel',
            'bedrock:ListFoundationModels'
          ],
          Resource: [
            // Claude 모델 ARN 패턴 (MedGemma 대신)
            `arn:aws:bedrock:${claudeConfig.region}::foundation-model/anthropic.claude-*`,
            // 특정 모델 ARN
            `arn:aws:bedrock:${claudeConfig.region}::foundation-model/${claudeConfig.modelId}`,
            // 다른 의료 관련 모델들 (필요시)
            `arn:aws:bedrock:${claudeConfig.region}::foundation-model/meta.llama*`,
            `arn:aws:bedrock:${claudeConfig.region}::foundation-model/mistral.*`
          ]
        }
      ]
    })
  }
)

// Bedrock Knowledge Base Access Policy (의료 지식 베이스용)
export const bedrockKnowledgeBasePolicy = new aws.iam.Policy(
  'bedrockKnowledgeBasePolicy',
  {
    name: 'bedrock-knowledge-base-policy',
    description:
      'Policy for accessing AWS Bedrock Knowledge Bases for medical data',
    policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'bedrock:RetrieveAndGenerate',
            'bedrock:Retrieve',
            'bedrock:GetKnowledgeBase',
            'bedrock:ListKnowledgeBases',
            'bedrock:StartIngestionJob',
            'bedrock:GetIngestionJob',
            'bedrock:ListIngestionJobs'
          ],
          Resource: '*'
        },
        {
          Effect: 'Allow',
          Action: ['s3:GetObject', 's3:ListBucket'],
          Resource: [
            'arn:aws:s3:::medical-knowledge-base-*',
            'arn:aws:s3:::medical-knowledge-base-*/*'
          ]
        }
      ]
    })
  }
)

// CloudWatch Logs 정책 (Bedrock 호출 로깅용)
export const bedrockLoggingPolicy = new aws.iam.Policy('bedrockLoggingPolicy', {
  name: 'bedrock-logging-policy',
  description: 'Policy for logging Bedrock model invocations',
  policy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents'
        ],
        Resource: [
          'arn:aws:logs:*:*:log-group:/aws/lambda/bedrock-*',
          'arn:aws:logs:*:*:log-group:/aws/bedrock/*'
        ]
      }
    ]
  })
})

// Lambda 환경 변수용 Bedrock 설정
export const bedrockEnvironmentVariables = {
  AWS_BEDROCK_REGION: claudeConfig.region,
  BEDROCK_MODEL_ID: claudeConfig.modelId,
  BEDROCK_MAX_TOKENS: claudeConfig.maxTokens.toString(),
  BEDROCK_TEMPERATURE: claudeConfig.temperature.toString(),
  BEDROCK_RETRY_ATTEMPTS: '3',
  BEDROCK_TIMEOUT_MS: '300000' // 5분
}

// Bedrock 모델 액세스 설정을 IAM 역할에 연결하는 함수
export const attachBedrockPoliciesToRole = (role: aws.iam.Role) => {
  // Bedrock 모델 액세스 정책 연결
  new aws.iam.RolePolicyAttachment('bedrockModelPolicyAttachment', {
    role: role.name,
    policyArn: bedrockModelAccessPolicy.arn
  })

  // Bedrock Knowledge Base 정책 연결
  new aws.iam.RolePolicyAttachment('bedrockKnowledgeBasePolicyAttachment', {
    role: role.name,
    policyArn: bedrockKnowledgeBasePolicy.arn
  })

  // Bedrock 로깅 정책 연결
  new aws.iam.RolePolicyAttachment('bedrockLoggingPolicyAttachment', {
    role: role.name,
    policyArn: bedrockLoggingPolicy.arn
  })
}

// 출력값
export const bedrockOutputs = {
  modelId: claudeConfig.modelId,
  region: claudeConfig.region,
  modelAccessPolicyArn: bedrockModelAccessPolicy.arn,
  knowledgeBasePolicyArn: bedrockKnowledgeBasePolicy.arn,
  loggingPolicyArn: bedrockLoggingPolicy.arn
}
