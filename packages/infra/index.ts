import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import * as fs from 'node:fs'
import * as path from 'node:path'
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

// Simple MIME type mapping
const getMimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: { [key: string]: string } = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain'
  }

  return mimeTypes[ext] || 'application/octet-stream'
}

// Helper function to determine the key for file upload
const createFileKey = ({
  currentKeyPrefix,
  item
}: {
  currentKeyPrefix: string
  item: string
}): string => {
  if (!currentKeyPrefix) {
    return item
  }

  return path.join(currentKeyPrefix, item)
}

// Helper function to determine cache control policy
const getCacheControl = ({ key }: { key: string }): string => {
  if (key.includes('assets/')) {
    return 'public, max-age=31536000'
  }

  return 'public, max-age=86400'
}

// Function to upload files recursively
const uploadDirectory = (
  bucketLabel: pulumi.Output<string>,
  localPath: string,
  keyPrefix: string = ''
) => {
  const walkSync = (
    currentPath: string,
    currentKeyPrefix: string
  ): aws.s3.BucketObject[] => {
    const items = fs.readdirSync(currentPath)

    return items.reduce<aws.s3.BucketObject[]>((acc, item) => {
      const itemPath = path.join(currentPath, item)
      const stat = fs.statSync(itemPath)

      if (stat.isDirectory()) {
        const directoryFiles = walkSync(
          itemPath,
          path.join(currentKeyPrefix, item)
        )

        return [...acc, ...directoryFiles]
      }

      const key = createFileKey({ currentKeyPrefix, item })
      const contentType = getMimeType(itemPath)
      const cacheControl = getCacheControl({ key })

      const obj = new aws.s3.BucketObject(
        `object-${key.replace(/[^a-zA-Z0-9]/g, '-')}`,
        {
          bucket: bucketLabel,
          source: new pulumi.asset.FileAsset(itemPath),
          key: key,
          contentType: contentType,
          cacheControl: cacheControl
        }
      )

      return [...acc, obj]
    }, [])
  }

  return walkSync(localPath, keyPrefix)
}

// Create an S3 Bucket for static website hosting
const bucket = new aws.s3.BucketV2('s3-pulumi-test')

// Configure the bucket for static website hosting
const bucketWebsite = new aws.s3.BucketWebsiteConfigurationV2(
  'website-config',
  {
    bucket: bucket.id,
    indexDocument: {
      suffix: 'index.html'
    },
    errorDocument: {
      key: 'index.html' // SPA fallback
    }
  }
)

// Configure public access block (allow public read)
const bucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock(
  'public-access-block',
  {
    bucket: bucket.id,
    blockPublicAcls: false,
    blockPublicPolicy: false,
    ignorePublicAcls: false,
    restrictPublicBuckets: false
  }
)

// Create bucket policy for public read access
new aws.s3.BucketPolicy(
  'bucket-policy',
  {
    bucket: bucket.id,
    policy: pulumi.jsonStringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: pulumi.interpolate`${bucket.arn}/*`
        }
      ]
    })
  },
  { dependsOn: [bucketPublicAccessBlock] }
)

// Upload all files from the build directory
const buildPath = path.join(__dirname, '../../apps/web/build/client')
const uploadedFiles = uploadDirectory(bucket.id, buildPath)

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
  runtime: 'nodejs20.x',
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
  timeout: 300,
  memorySize: 1024
})

// Create HTTP API Gateway for both static hosting and API
const httpApi = new aws.apigatewayv2.Api('doctorGuideHttpApi', {
  name: 'doctor-guide-unified-http-api',
  protocolType: 'HTTP',
  description: 'Unified HTTP API for both static website and API endpoints',
  corsConfiguration: {
    allowCredentials: false,
    allowHeaders: ['*'],
    allowMethods: ['GET', 'HEAD', 'OPTIONS', 'POST'],
    allowOrigins: ['*'],
    exposeHeaders: [],
    maxAge: 300
  }
})

// Lambda integration for API routes
const lambdaIntegration = new aws.apigatewayv2.Integration(
  'lambdaIntegration',
  {
    apiId: httpApi.id,
    integrationType: 'AWS_PROXY',
    integrationUri: lambdaFunction.invokeArn,
    payloadFormatVersion: '2.0'
  }
)

// S3 integration for static assets
const s3Integration = new aws.apigatewayv2.Integration('s3Integration', {
  apiId: httpApi.id,
  integrationType: 'HTTP_PROXY',
  integrationMethod: 'GET',
  integrationUri: pulumi.interpolate`http://${bucketWebsite.websiteEndpoint}/{proxy}`,
  payloadFormatVersion: '1.0'
})

// Root integration to serve index.html
const rootIntegration = new aws.apigatewayv2.Integration('rootIntegration', {
  apiId: httpApi.id,
  integrationType: 'HTTP_PROXY',
  integrationMethod: 'GET',
  integrationUri: pulumi.interpolate`http://${bucketWebsite.websiteEndpoint}/index.html`,
  payloadFormatVersion: '1.0'
})

const getRouteKey = (routeName: string): string => {
  if (routeName === 'medChat' || routeName === 'medDiagnosis') {
    return 'POST'
  }

  return 'GET'
}

// API routes
const apiRoutes = [
  { path: '/api', name: 'apiRoot' },
  { path: '/api/docs', name: 'docs' },
  { path: '/api/hospital', name: 'hospital' },
  { path: '/api/pharmacy', name: 'pharmacy' },
  { path: '/api/med/chat', name: 'medChat' },
  { path: '/api/med/diagnosis', name: 'medDiagnosis' }
]

apiRoutes.forEach(
  (route) =>
    new aws.apigatewayv2.Route(`${route.name}Route`, {
      apiId: httpApi.id,
      routeKey: `${getRouteKey(route.name)} ${route.path}`,
      target: pulumi.interpolate`integrations/${lambdaIntegration.id}`
    })
)

// Static asset routes
new aws.apigatewayv2.Route('staticAssetsRoute', {
  apiId: httpApi.id,
  routeKey: 'GET /assets/{proxy+}',
  target: pulumi.interpolate`integrations/${s3Integration.id}`
})

new aws.apigatewayv2.Route('staticFilesRoute', {
  apiId: httpApi.id,
  routeKey: 'GET /{proxy+}',
  target: pulumi.interpolate`integrations/${s3Integration.id}`
})

// Root route for SPA
new aws.apigatewayv2.Route('rootRoute', {
  apiId: httpApi.id,
  routeKey: 'GET /',
  target: pulumi.interpolate`integrations/${rootIntegration.id}`
})

// Create stage
new aws.apigatewayv2.Stage('defaultStage', {
  apiId: httpApi.id,
  name: '$default',
  autoDeploy: true
})

// Lambda permissions
new aws.lambda.Permission('apiGatewayPermission', {
  action: 'lambda:InvokeFunction',
  function: lambdaFunction.name,
  principal: 'apigateway.amazonaws.com',
  sourceArn: pulumi.interpolate`${httpApi.executionArn}/*/*`
})

// Export outputs
export const apiUrl = httpApi.apiEndpoint
export const bucketName = bucket.id
export const websiteEndpoint = bucketWebsite.websiteEndpoint
export const s3WebsiteUrl = pulumi.interpolate`http://${bucketWebsite.websiteEndpoint}`
export const httpApiEndpoint = httpApi.apiEndpoint
export const apiGatewayUrl = pulumi.interpolate`${httpApi.apiEndpoint}`
export const uploadedFileCount = uploadedFiles.length
export const {
  modelId: medgemmaModelId,
  modelAccessPolicyArn: bedrockModelAccessPolicyArn
} = bedrockOutputs
