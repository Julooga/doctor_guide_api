# hono + openapi

## 개발환경

```
"node": ">=20.0.0"
"pnpm": ">=9.0.0"
```

## 배포

```
pnpm i
pnpm lambda:deploy
```

## 사용한 AWS 리소스

- Dynamo DB
  - Hospital-safetydata : arn:aws:dynamodb:ap-northeast-2:166287530750:table/Hospital-safetydata
  - Pharamacy-safetydata : arn:aws:dynamodb:ap-northeast-2:166287530750:table/Pharamacy-safetydata
- Lambda : arn:aws:lambda:ap-northeast-2:166287530750:function:doctor_guide_api
- API Gateway :
  - / : arn:aws:apigateway:ap-northeast-2::/apis/1acgaqfa8f/routes/1gqsibp
  - /docs : arn:aws:apigateway:ap-northeast-2::/apis/1acgaqfa8f/routes/u42m1ya
