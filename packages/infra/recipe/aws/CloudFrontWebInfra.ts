import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import { BucketV2 } from '@pulumi/aws/s3'
import { Distribution } from '@pulumi/aws/cloudfront'

type Params = {
  bucket: BucketV2
  websiteEndpoint: pulumi.Output<string>
}

export class CloudFrontWebInfra extends pulumi.ComponentResource {
  distribution: Distribution

  constructor(
    _name: string,
    params: Params,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super('organizaton:utils:CloudFrontWebInfra', _name, {}, opts)

    // 클라우드 프론트 배포 생성
    this.distribution = new aws.cloudfront.Distribution(
      `distribution-${_name}-${pulumi.getStack()}`,
      {
        enabled: true,
        origins: [
          {
            originId: params.bucket.bucket,
            // S3 website endpoint에서 protocol 제거 (http:// 부분 제거)
            domainName: params.websiteEndpoint.apply((endpoint) =>
              endpoint.replace(/^https?:\/\//, '')
            ),
            customOriginConfig: {
              httpPort: 80,
              httpsPort: 443,
              originProtocolPolicy: 'http-only',
              originSslProtocols: ['TLSv1.2']
            }
          }
        ],
        defaultRootObject: 'index.html',
        defaultCacheBehavior: {
          targetOriginId: params.bucket.bucket,
          viewerProtocolPolicy: 'redirect-to-https',
          allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
          cachedMethods: ['GET', 'HEAD'],
          forwardedValues: {
            queryString: false,
            cookies: {
              forward: 'none'
            }
          },
          minTtl: 0,
          defaultTtl: 3600,
          maxTtl: 86400
        },
        // SPA 지원을 위한 커스텀 에러 페이지 설정
        customErrorResponses: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/index.html',
            errorCachingMinTtl: 300
          },
          {
            errorCode: 403,
            responseCode: 200,
            responsePagePath: '/index.html',
            errorCachingMinTtl: 300
          }
        ],
        priceClass: 'PriceClass_100',
        restrictions: {
          geoRestriction: {
            restrictionType: 'none'
          }
        },
        viewerCertificate: {
          cloudfrontDefaultCertificate: true
        },
        // 배포 완료 대기 (선택사항 - 개발 시에는 true 권장)
        waitForDeployment: true
      },
      {
        parent: this
      }
    )

    this.registerOutputs({
      distribution: this.distribution,
      cloudFrontUrl: this.cloudFrontWeb,
      distributionStatus: this.distribution.status
    })
  }

  get cloudFrontWeb() {
    return pulumi.interpolate`https://${this.distribution.domainName}`
  }

  get distributionStatus() {
    return this.distribution.status
  }
}
