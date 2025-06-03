import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import * as apigateway from '@pulumi/aws-apigateway'

// DynamoDB Table for Hospital data
const hospitalTable = new aws.dynamodb.Table('HospitalSafetydata', {
  name: 'Hospital',
  billingMode: 'PAY_PER_REQUEST',
  attributes: [
    { name: 'pk', type: 'S' },
    { name: 'sk', type: 'S' },
    { name: 'HSPTL_CLSF_NM', type: 'S' },
    { name: 'INST_NM', type: 'S' },
    { name: 'EMRO_OPER_YN_', type: 'S' },
    { name: 'ADDR_REGION', type: 'S' }
  ],
  hashKey: 'pk',
  rangeKey: 'sk',
  globalSecondaryIndexes: [
    {
      name: 'hospital-classification-index',
      hashKey: 'HSPTL_CLSF_NM',
      rangeKey: 'INST_NM',
      projectionType: 'ALL'
    },
    {
      name: 'hospital-name-index',
      hashKey: 'INST_NM',
      projectionType: 'ALL'
    },
    {
      name: 'emergency-room-index',
      hashKey: 'EMRO_OPER_YN_',
      rangeKey: 'HSPTL_CLSF_NM',
      projectionType: 'ALL'
    },
    {
      name: 'region-index',
      hashKey: 'ADDR_REGION',
      rangeKey: 'INST_NM',
      projectionType: 'ALL'
    }
  ]
})

// DynamoDB Table for Pharmacy data
const pharmacyTable = new aws.dynamodb.Table('PharmacySafetydata', {
  name: 'Pharmacy',
  billingMode: 'PAY_PER_REQUEST',
  attributes: [
    { name: 'pk', type: 'S' },
    { name: 'sk', type: 'S' },
    { name: 'INST_NM', type: 'S' },
    { name: 'ADDR_REGION', type: 'S' },
    { name: 'WKND_MDEXM_YN', type: 'S' }
  ],
  hashKey: 'pk',
  rangeKey: 'sk',
  globalSecondaryIndexes: [
    {
      name: 'pharmacy-name-index',
      hashKey: 'INST_NM',
      projectionType: 'ALL'
    },
    {
      name: 'pharmacy-region-index',
      hashKey: 'ADDR_REGION',
      rangeKey: 'INST_NM',
      projectionType: 'ALL'
    },
    {
      name: 'pharmacy-weekend-index',
      hashKey: 'WKND_MDEXM_YN',
      rangeKey: 'INST_NM',
      projectionType: 'ALL'
    }
  ]
})

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

// IAM Policy for DynamoDB access
const dynamoPolicy = new aws.iam.Policy('dynamoPolicy', {
  policy: pulumi
    .all([hospitalTable.arn, pharmacyTable.arn])
    .apply(([hospitalArn, pharmacyArn]) =>
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem'
            ],
            Resource: [
              hospitalArn,
              `${hospitalArn}/index/*`,
              pharmacyArn,
              `${pharmacyArn}/index/*`
            ]
          }
        ]
      })
    )
})

// Attach basic Lambda execution policy
new aws.iam.RolePolicyAttachment('lambdaExecutionPolicyAttachment', {
  role: lambdaRole.name,
  policyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
})

// Attach DynamoDB policy to Lambda role
new aws.iam.RolePolicyAttachment('dynamoPolicyAttachment', {
  role: lambdaRole.name,
  policyArn: dynamoPolicy.arn
})

// Lambda function
const lambdaFunction = new aws.lambda.Function('doctorGuideApiFunction', {
  runtime: 'nodejs14.x', // Updated to a valid runtime version
  role: lambdaRole.arn,
  handler: 'dist/index.handler',
  code: new pulumi.asset.AssetArchive({
    '.': new pulumi.asset.FileArchive('./dist') // Updated to point to the correct directory
  }),
  environment: {
    variables: {
      NODE_ENV: pulumi.getStack()
    }
  }
})

const api = new apigateway.RestAPI('doctorGuideApi', {
  routes: [
    {
      path: '/hospital',
      method: 'GET',
      eventHandler: lambdaFunction
    },
    {
      path: '/pharmacy',
      method: 'GET',
      eventHandler: lambdaFunction
    }
  ]
})

// Export outputs
export const hospitalTableName = hospitalTable.name
export const pharmacyTableName = pharmacyTable.name
export const apiUrl = api.url
