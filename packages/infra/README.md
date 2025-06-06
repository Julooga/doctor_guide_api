# AWS TypeScript Pulumi Template

A minimal Pulumi template for provisioning AWS infrastructure using TypeScript. This template creates an Amazon S3 bucket and exports its name.

## Prerequisites

- Pulumi CLI (>= v3): https://www.pulumi.com/docs/get-started/install/
- Node.js (>= 14): https://nodejs.org/
- AWS credentials configured (e.g., via `aws configure` or environment variables)

## Getting Started

1.  Initialize a new Pulumi project:

    ```bash
    pulumi new aws-typescript
    ```

    Follow the prompts to set your:

    - Project name
    - Project description
    - AWS region (defaults to `us-east-1`)

2.  Preview and deploy your infrastructure:

    ```bash
    pulumi preview
    pulumi up
    ```

3.  When you're finished, tear down your stack:

    ```bash
    pulumi destroy
    pulumi stack rm
    ```

## Project Layout

- `Pulumi.yaml` — Pulumi project and template metadata
- `index.ts` — Main Pulumi program (creates an S3 bucket)
- `package.json` — Node.js dependencies
- `tsconfig.json` — TypeScript compiler options

## Configuration

| Key          | Description                             | Default     |
| ------------ | --------------------------------------- | ----------- |
| `aws:region` | The AWS region to deploy resources into | `us-east-1` |

Use `pulumi config set <key> <value>` to customize configuration.

## Next Steps

- Extend `index.ts` to provision additional resources (e.g., VPCs, Lambda functions, DynamoDB tables).
- Explore [Pulumi AWSX](https://www.pulumi.com/docs/reference/pkg/awsx/) for higher-level AWS components.
- Consult the [Pulumi documentation](https://www.pulumi.com/docs/) for more examples and best practices.

## Getting Help

If you encounter any issues or have suggestions, please open an issue in this repository.

# AWS Bedrock MedGemma 인프라

## 개요

이 Pulumi 프로젝트는 AWS Bedrock에서 MedGemma 모델을 사용하기 위한 인프라를 정의합니다.

## 포함된 리소스

### Bedrock 관련 리소스

- **IAM 정책**: MedGemma 모델 액세스 권한
- **Knowledge Base 정책**: 의료 지식 베이스 액세스
- **CloudWatch 로깅**: Bedrock 호출 로깅
- **Lambda 함수**: MedGemma API 엔드포인트

### API 엔드포인트

- `GET /` - 기본 엔드포인트
- `GET /docs` - API 문서
- `GET /hospital` - 병원 정보
- `GET /pharmacy` - 약국 정보
- `POST /medgemma/chat` - MedGemma 채팅 인터페이스
- `POST /medgemma/diagnosis` - MedGemma 진단 보조

## 환경 변수

Lambda 함수에 자동으로 설정되는 환경 변수:

```bash
AWS_BEDROCK_REGION=us-west-2
MEDGEMMA_MODEL_ID=google.gemma-3-27b-instruct-v1:0
BEDROCK_MAX_TOKENS=4096
BEDROCK_TEMPERATURE=0.1
BEDROCK_RETRY_ATTEMPTS=3
BEDROCK_TIMEOUT_MS=300000
```

## 배포 전 준비사항

### 1. AWS Bedrock 모델 액세스 요청

1. AWS Bedrock 콘솔에 접속
2. Foundation models → Model catalog로 이동
3. Google → Gemma 모델 찾기
4. 모델 액세스 요청 (승인까지 시간 소요 가능)

### 2. AWS CLI 및 Pulumi 설정

```bash
# AWS 프로필 설정
aws configure --profile jurloogar

# Pulumi 로그인
pulumi login
```

## 배포 명령어

```bash
# 패키지 설치
pnpm install

# 타입 체크
pnpm run typecheck

# 인프라 배포
pnpm run deploy

# 인프라 삭제
pnpm run destroy
```

## MedGemma 사용 예제

### 기본 채팅 API

```javascript
const response = await fetch(`${API_URL}/medgemma/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: '의료진을 위한 고혈압 관리 가이드라인을 알려주세요.',
    maxTokens: 2048,
    temperature: 0.1
  })
})
```

### 진단 보조 API

```javascript
const response = await fetch(`${API_URL}/medgemma/diagnosis`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    symptoms: ['두통', '열', '목 경직'],
    patientHistory: '30세 남성, 기존 병력 없음'
  })
})
```

## 보안 고려사항

1. **IAM 권한**: 최소 권한 원칙 적용
2. **API 인증**: 프로덕션 환경에서는 API 키 또는 JWT 토큰 인증 추가 권장
3. **로깅**: 모든 Bedrock 호출이 CloudWatch에 기록됨
4. **데이터 보호**: 의료 데이터 처리 시 HIPAA 준수 고려

## 모니터링

### CloudWatch 메트릭

- Lambda 함수 실행 시간
- Bedrock 모델 호출 횟수
- 에러 발생률

### 로그 확인

```bash
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/bedrock
```

## 비용 최적화

1. **Lambda**: 메모리와 타임아웃 적절히 설정
2. **Bedrock**: 토큰 사용량 모니터링
3. **API Gateway**: 사용량 기반 요금제 고려

## 문제 해결

### 일반적인 오류

1. **모델 액세스 거부**

   - AWS Bedrock 콘솔에서 모델 액세스 상태 확인
   - IAM 권한 검토

2. **타임아웃 오류**

   - Lambda 타임아웃 증가
   - Bedrock 호출 재시도 로직 구현

3. **토큰 한도 초과**
   - 프롬프트 길이 조정
   - max_tokens 설정 검토

## 다음 단계

1. **Knowledge Base 구축**: 의료 지식 베이스 생성 및 연동
2. **Fine-tuning**: 특정 의료 도메인에 맞는 모델 미세 조정
3. **Multi-modal**: 이미지 분석 기능 추가
4. **실시간 스트리밍**: 응답 스트리밍 기능 구현
