import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import {
  attachBedrockPoliciesToRole,
  bedrockEnvironmentVariables,
  bedrockOutputs
} from './bedrock'

// 인프라 프로버저닝은 잠시 보류[s]
// // DynamoDB Table for Hospital data
// const hospitalTable = new aws.dynamodb.Table('HospitalSafetydata', {
//   name: 'Hospital',
//   billingMode: 'PAY_PER_REQUEST',
//   attributes: [
//     { name: 'pk', type: 'S' },
//     { name: 'sk', type: 'S' },
//     { name: 'HSPTL_CLSF_NM', type: 'S' },
//     { name: 'INST_NM', type: 'S' },
//     { name: 'EMRO_OPER_YN_', type: 'S' },
//     { name: 'ADDR_REGION', type: 'S' }
//   ],
//   hashKey: 'pk',
//   rangeKey: 'sk',
//   globalSecondaryIndexes: [
//     {
//       name: 'hospital-classification-index',
//       hashKey: 'HSPTL_CLSF_NM',
//       rangeKey: 'INST_NM',
//       projectionType: 'ALL'
//     },
//     {
//       name: 'hospital-name-index',
//       hashKey: 'INST_NM',
//       projectionType: 'ALL'
//     },
//     {
//       name: 'emergency-room-index',
//       hashKey: 'EMRO_OPER_YN_',
//       rangeKey: 'HSPTL_CLSF_NM',
//       projectionType: 'ALL'
//     },
//     {
//       name: 'region-index',
//       hashKey: 'ADDR_REGION',
//       rangeKey: 'INST_NM',
//       projectionType: 'ALL'
//     }
//   ]
// })
//
// DynamoDB Table for Pharmacy data
// const pharmacyTable = new aws.dynamodb.Table('PharmacySafetydata', {
//   name: 'Pharmacy',
//   billingMode: 'PAY_PER_REQUEST',
//   attributes: [
//     { name: 'pk', type: 'S' },
//     { name: 'sk', type: 'S' },
//     { name: 'INST_NM', type: 'S' },
//     { name: 'ADDR_REGION', type: 'S' },
//     { name: 'WKND_MDEXM_YN', type: 'S' }
//   ],
//   hashKey: 'pk',
//   rangeKey: 'sk',
//   globalSecondaryIndexes: [
//     {
//       name: 'pharmacy-name-index',
//       hashKey: 'INST_NM',
//       projectionType: 'ALL'
//     },
//     {
//       name: 'pharmacy-region-index',
//       hashKey: 'ADDR_REGION',
//       rangeKey: 'INST_NM',
//       projectionType: 'ALL'
//     },
//     {
//       name: 'pharmacy-weekend-index',
//       hashKey: 'WKND_MDEXM_YN',
//       rangeKey: 'INST_NM',
//       projectionType: 'ALL'
//     }
//   ]
// })

// // IAM Policy for DynamoDB access
// const dynamoPolicy = new aws.iam.Policy('dynamoPolicy', {
//   policy: pulumi
//     .all([hospitalTable.arn, pharmacyTable.arn])
//     .apply(([hospitalArn, pharmacyArn]) =>
//       JSON.stringify({
//         Version: '2012-10-17',
//         Statement: [
//           {
//             Effect: 'Allow',
//             Action: [
//               'dynamodb:Query',
//               'dynamodb:Scan',
//               'dynamodb:GetItem',
//               'dynamodb:PutItem',
//               'dynamodb:UpdateItem',
//               'dynamodb:DeleteItem'
//             ],
//             Resource: [
//               hospitalArn,
//               `${hospitalArn}/index/*`,
//               pharmacyArn,
//               `${pharmacyArn}/index/*`
//             ]
//           }
//         ]
//       })
//     )
// })

// // Attach basic Lambda execution policy
// new aws.iam.RolePolicyAttachment('lambdaExecutionPolicyAttachment', {
//   role: lambdaRole.name,
//   policyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
// })

// // Attach DynamoDB policy to Lambda role
// new aws.iam.RolePolicyAttachment('dynamoPolicyAttachment', {
//   role: lambdaRole.name,
//   policyArn: dynamoPolicy.arn
// })

// export const hospitalTableName = hospitalTable.name
// export const pharmacyTableName = pharmacyTable.name
// 인프라 프로버저닝은 잠시 보류[e]

// IAM Role for Lambda functions
const lambdaRole = new aws.iam.Role('lambdaRole', {
  assumeRolePolicy: JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'sts:AssumeRole',
        Principal: {
          Service: 'lambda.amazonaws.com'
        },
        Effect: 'Allow'
      }
    ]
  })
})

// Lambda execution role에 Bedrock 정책 연결 (bedrock.ts의 함수 사용)
attachBedrockPoliciesToRole(lambdaRole)

// Lambda function
const lambdaFunction = new aws.lambda.Function('doctorGuideApiFunction', {
  runtime: 'nodejs20.x', // Updated to a valid runtime version
  role: lambdaRole.arn,
  handler: 'index.handler',
  code: new pulumi.asset.AssetArchive({
    '.': new pulumi.asset.FileArchive('../../apps/api/dist')
  }),
  environment: {
    variables: {
      NODE_ENV: pulumi.getStack(),
      // Bedrock 관련 환경 변수 (bedrock.ts에서 가져옴)
      ...bedrockEnvironmentVariables
    }
  },
  timeout: 300, // Bedrock 모델 호출을 위한 타임아웃 증가
  memorySize: 1024 // 메모리 증가
})

// HTTP API 생성
const api = new aws.apigatewayv2.Api('doctorGuideApi', {
  name: 'doctor-guide-http-api',
  protocolType: 'HTTP'
})

// Lambda 통합 생성
const integration = new aws.apigatewayv2.Integration('lambdaIntegration', {
  apiId: api.id,
  integrationType: 'AWS_PROXY',
  integrationUri: lambdaFunction.invokeArn,
  payloadFormatVersion: '2.0'
})

const getRouteKey = (routeName: string) => {
  if (routeName === 'medChat' || routeName === 'medDiagnosis') {
    return 'POST'
  }

  return 'GET'
}

// 각 경로에 대한 라우트 생성 (MedGemma 엔드포인트 포함)
;[
  { path: '/', name: 'root' },
  { path: '/docs', name: 'docs' },
  { path: '/hospital', name: 'hospital' },
  { path: '/pharmacy', name: 'pharmacy' },
  { path: '/med/chat', name: 'medChat' },
  { path: '/med/diagnosis', name: 'medDiagnosis' }
].forEach(
  (route) =>
    new aws.apigatewayv2.Route(`${route.name}Route`, {
      apiId: api.id,
      routeKey: `${getRouteKey(route.name)} ${route.path}`,
      target: pulumi.interpolate`integrations/${integration.id}`
    })
)

// 스테이지 생성
new aws.apigatewayv2.Stage('defaultStage', {
  apiId: api.id,
  name: '$default',
  autoDeploy: true
})

// Lambda 권한 부여
new aws.lambda.Permission('apiGatewayPermission', {
  action: 'lambda:InvokeFunction',
  function: lambdaFunction.name,
  principal: 'apigateway.amazonaws.com',
  sourceArn: pulumi.interpolate`${api.executionArn}/*/*`
})

// API URL 출력
export const apiUrl = api.apiEndpoint
export const {
  modelId: medgemmaModelId,
  modelAccessPolicyArn: bedrockModelAccessPolicyArn
} = bedrockOutputs
