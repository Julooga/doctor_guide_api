import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import { Api } from '@pulumi/aws/apigatewayv2'

type EndPoint = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'
  path: string
}

type Params = {
  endpoints: EndPoint[]
  pathname: string
  env?: Record<string, string>
}

export class LambdaInfra extends pulumi.ComponentResource {
  api: Api

  constructor(
    _name: string,
    params: Params,
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

    // Lambda function
    const lambdaFunction = new aws.lambda.Function(
      '람다 함수',
      {
        name: `${_name}-lambda-${pulumi.getStack()}`,
        runtime: 'nodejs20.x', // Updated to a valid runtime version
        role: lambdaRole.arn,
        handler: 'index.handler',
        code: new pulumi.asset.AssetArchive({
          '.': new pulumi.asset.FileArchive(params.pathname)
        }),
        environment: {
          variables: {
            STACK: pulumi.getStack(),
            PROJECT: pulumi.getProject(),
            ...(params.env || {})
          }
        },
        timeout: 300,
        memorySize: 1024
      },
      {
        parent: this
      }
    )

    // HTTP API 생성
    this.api = new aws.apigatewayv2.Api(
      'http api',
      {
        name: `${_name}-http-api-${pulumi.getStack()}`,
        protocolType: 'HTTP'
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

    // 엔드포인트 매핑
    const routes: aws.apigatewayv2.Route[] = params.endpoints.map(
      (route, index) => {
        // 안전한 리소스 이름 생성
        const safeName = `${route.method.toLowerCase()}-${route.path
          .replace(/[^a-zA-Z0-9]/g, '-')
          .replace(/^-+|-+$/g, '')
          .replace(/-+/g, '-')
          .toLowerCase()}`

        // 인덱스 추가로 중복 방지
        const resourceName = `route-${index}-${safeName}-${pulumi.getStack()}`

        const route_resource = new aws.apigatewayv2.Route(
          resourceName,
          {
            apiId: this.api.id,
            routeKey: `${route.method} ${route.path}`,
            target: pulumi.interpolate`integrations/${integration.id}`
          },
          {
            parent: this,
            dependsOn: [integration] // 통합에 의존성 추가
          }
        )

        return route_resource
      }
    )

    // API Gateway 배포 생성
    const deployment = new aws.apigatewayv2.Deployment(
      `${_name}-deployment-${pulumi.getStack()}`,
      {
        apiId: this.api.id,
        description: `${_name}의 ${pulumi.getStack()} 배포 스테이지`,
        // 강제 재배포를 위한 트리거 추가
        triggers: {
          redeployment: pulumi
            .all([integration.id, ...routes.map((r) => r.id)])
            .apply((ids) => ids.join('-'))
        }
      },
      {
        parent: this,
        dependsOn: [integration, ...routes] // 모든 라우트와 통합이 생성된 후 배포
      }
    )

    // 스테이지 생성 - 리소스 이름 변경
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
