import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import { Api } from '@pulumi/aws/apigatewayv2'

type EndPoint = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'
  path: string
}

type LambdaInfraParams = {
  endpoints: EndPoint[]
  pathname: string
  env?: Record<string, string>
}

type BedrockPolicyStatement = {
  Effect: string
  Action: string[]
  Resource: string[]
}

type BedrockPolicy = {
  Version: string
  Statement: BedrockPolicyStatement[]
}

export class LambdaInfra extends pulumi.ComponentResource {
  api: Api

  constructor(
    _name: string,
    { endpoints, pathname, env }: LambdaInfraParams,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super('organizaton:utils:LambdaInfra', _name, {}, opts)

    // IAM Role for Lambda functions
    const lambdaRole = new aws.iam.Role(
      '람다 롤',
      {
        name: `${_name}-lambdaRole-${pulumi.getStack()}`,
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
      },
      {
        parent: this
      }
    )

    // CloudWatch Logs 작성
    new aws.iam.RolePolicyAttachment(
      `${_name}-lambda-execution-policy-${pulumi.getStack()}`,
      {
        role: lambdaRole.name,
        policyArn:
          'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
      },
      {
        parent: this
      }
    )

    // Bedrock 권한 추가
    const bedrockPolicy: BedrockPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'bedrock:InvokeModel',
            'bedrock:InvokeModelWithResponseStream',
            'bedrock:ListFoundationModels'
          ],
          Resource: [
            'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0',
            'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-*'
          ]
        }
      ]
    }

    new aws.iam.RolePolicy(
      `${_name}-bedrock-policy-${pulumi.getStack()}`,
      {
        role: lambdaRole.name,
        policy: JSON.stringify(bedrockPolicy)
      },
      {
        parent: this
      }
    )

    // DynamoDB 권한 추가
    const dynamoDbPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:Scan',
            'dynamodb:Query',
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:DeleteItem',
            'dynamodb:BatchGetItem',
            'dynamodb:BatchWriteItem',
            'dynamodb:DescribeTable'
          ],
          Resource: [
            'arn:aws:dynamodb:ap-northeast-2:*:table/Hospital-*',
            'arn:aws:dynamodb:ap-northeast-2:*:table/Pharmacy-*',
            'arn:aws:dynamodb:ap-northeast-2:*:table/*'
          ]
        }
      ]
    }

    new aws.iam.RolePolicy(
      `${_name}-dynamodb-policy-${pulumi.getStack()}`,
      {
        role: lambdaRole.name,
        policy: JSON.stringify(dynamoDbPolicy)
      },
      {
        parent: this
      }
    )

    // Lambda function
    const lambdaFunction = new aws.lambda.Function(
      '람다 함수',
      {
        name: `${_name}-lambda-${pulumi.getStack()}`,
        runtime: 'nodejs20.x',
        role: lambdaRole.arn,
        handler: 'index.handler',
        code: new pulumi.asset.AssetArchive({
          '.': new pulumi.asset.FileArchive(pathname)
        }),
        environment: {
          variables: {
            STACK: pulumi.getStack(),
            PROJECT: pulumi.getProject(),
            ...(env || {})
          }
        },
        timeout: 300,
        memorySize: 1024
      },
      {
        parent: this
      }
    )

    // HTTP API 생성 (CORS 설정 포함)
    this.api = new aws.apigatewayv2.Api(
      'http api',
      {
        name: `${_name}-http-api-${pulumi.getStack()}`,
        protocolType: 'HTTP',
        corsConfiguration: {
          allowCredentials: false,
          allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
          allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowOrigins: ['*'],
          exposeHeaders: ['X-CLARIFY-NEEDED'],
          maxAge: 86400
        }
      },
      {
        parent: this
      }
    )

    // Lambda 통합 생성
    const integration = new aws.apigatewayv2.Integration(
      `${_name}-lambda-integration-${pulumi.getStack()}`,
      {
        apiId: this.api.id,
        integrationType: 'AWS_PROXY',
        integrationUri: lambdaFunction.invokeArn,
        payloadFormatVersion: '2.0'
      },
      {
        parent: this
      }
    )

    // OPTIONS 라우트 자동 추가
    const allEndpoints = endpoints.reduce((acc, endpoint) => {
      if (endpoint.method !== 'OPTIONS') {
        return [...acc, { method: 'OPTIONS' as const, path: endpoint.path }]
      }

      return [...acc, endpoint]
    }, [] as EndPoint[])

    // 엔드포인트 매핑
    const routes: aws.apigatewayv2.Route[] = allEndpoints.map(
      (route, index) => {
        const safeName = `${route.method.toLowerCase()}-${route.path
          .replace(/[^a-zA-Z0-9]/g, '-')
          .replace(/^-+|-+$/g, '')
          .replace(/-+/g, '-')
          .toLowerCase()}`

        const resourceName = `route-${index}-${safeName}-${pulumi.getStack()}`

        return new aws.apigatewayv2.Route(
          resourceName,
          {
            apiId: this.api.id,
            routeKey: `${route.method} ${route.path}`,
            target: pulumi.interpolate`integrations/${integration.id}`
          },
          {
            parent: this,
            dependsOn: [integration]
          }
        )
      }
    )

    // API Gateway 배포 생성
    const deployment = new aws.apigatewayv2.Deployment(
      `${_name}-deployment-${pulumi.getStack()}`,
      {
        apiId: this.api.id,
        description: `${_name}의 ${pulumi.getStack()} 배포 스테이지`,
        triggers: {
          redeployment: pulumi
            .all([integration.id, ...routes.map((r) => r.id)])
            .apply((ids) => ids.join('-'))
        }
      },
      {
        parent: this,
        dependsOn: [integration, ...routes]
      }
    )

    // 스테이지 생성
    new aws.apigatewayv2.Stage(
      `${_name}-${pulumi.getStack()}-stage`,
      {
        apiId: this.api.id,
        deploymentId: deployment.id,
        name: '$default',
        autoDeploy: false
      },
      {
        parent: this,
        dependsOn: [deployment]
      }
    )

    // Lambda 권한 부여
    new aws.lambda.Permission(
      `${_name}-apiGatewayPermission-${pulumi.getStack()}`,
      {
        action: 'lambda:InvokeFunction',
        function: lambdaFunction.name,
        principal: 'apigateway.amazonaws.com',
        sourceArn: pulumi.interpolate`${this.api.executionArn}/*/*`
      },
      {
        parent: this
      }
    )

    this.registerOutputs({
      apiEndpoint: this.apiEndpoint
    })
  }

  get apiEndpoint() {
    return this.api.apiEndpoint
  }
}
