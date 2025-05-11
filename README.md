# 긴급정보 서비스 API (Emergency Info Service API) 🚑🌐

[![semantic-release: hono](https://img.shields.io/badge/semantic--release-hono-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## 개발환경 (Development Environment) 🛠️

```plaintext
"node": ">=20.0.0"
"pnpm": ">=9.0.0"
```

## 배포 (Deployment) 🚀

```plaintext
pnpm i
pnpm lambda:deploy
```

## 리소스 주소 (Resource URLs) 🌍

- **스웨거 UI (Swagger UI)**: [https://1acgaqfa8f.execute-api.ap-northeast-2.amazonaws.com/](https://1acgaqfa8f.execute-api.ap-northeast-2.amazonaws.com/) 📖
- **스웨거 Docs (Swagger Docs)**: [https://1acgaqfa8f.execute-api.ap-northeast-2.amazonaws.com/docs](https://1acgaqfa8f.execute-api.ap-northeast-2.amazonaws.com/docs) 📚

## 사용한 AWS 리소스 (AWS Resources Used) ☁️

- **DynamoDB** 🗄️
  - Hospital-safetydata: `arn:aws:dynamodb:ap-northeast-2:166287530750:table/Hospital-safetydata`
  - Pharamacy-safetydata: `arn:aws:dynamodb:ap-northeast-2:166287530750:table/Pharamacy-safetydata`
- **Lambda** 🖥️: `arn:aws:lambda:ap-northeast-2:166287530750:function:doctor_guide_api`
- **API Gateway** 🌐
  - `/`: `arn:aws:apigateway:ap-northeast-2::/apis/1acgaqfa8f/routes/1gqsibp`
  - `/docs`: `arn:aws:apigateway:ap-northeast-2::/apis/1acgaqfa8f/routes/u42m1ya`
