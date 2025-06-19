import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import { BucketV2 } from '@pulumi/aws/s3'
import { uploadToS3 } from './utils/uploadToS3'

type Params = {
  // 배포 대상의 파일시스템 경로
  pathname: string
  env?: Record<string, string>
}

/**
 * http로 퍼블릭 엑세스를 허용하는 버킷을 생성한다.
 */
export class S3WebInfra extends pulumi.ComponentResource {
  bucket: BucketV2
  websiteEndpoint: pulumi.Output<string>

  constructor(_name: string, params: Params, opts?: pulumi.ResourceOptions) {
    super('organizaton:utils:S3WebInfra', _name, {}, opts)

    this.bucket = new aws.s3.BucketV2(
      '스태틱 리소스 서빙용 s3',
      {
        bucket: pulumi.interpolate`s3-${_name}-${pulumi.getStack()}`
      },
      {
        parent: this
      }
    )

    uploadToS3({
      bucket: this.bucket.bucket,
      pathname: params.pathname,
      parentResource: this
    })

    // 스태틱 웹사이트를 배포하는 룰
    const bucketWebsiteConfig = new aws.s3.BucketWebsiteConfigurationV2(
      `bucket-config-${_name}-${pulumi.getStack()}`,
      {
        bucket: this.bucket.id,
        indexDocument: {
          suffix: 'index.html'
        },
        errorDocument: {
          key: 'index.html' // SPA fallback
        }
      },
      {
        parent: this
      }
    )
    this.websiteEndpoint = bucketWebsiteConfig.websiteEndpoint

    // 버킷에 퍼블릭 엑세스 지정
    const bucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock(
      `bucket-public-access-${_name}-${pulumi.getStack()}`,
      {
        bucket: this.bucket.id,
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      },
      {
        parent: this
      }
    )

    // 버킷 정책 결합
    new aws.s3.BucketPolicy(
      `bucket-policy-${_name}-${pulumi.getStack()}`,
      {
        bucket: this.bucket.id,
        policy: pulumi.jsonStringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: 's3:GetObject',
              Resource: pulumi.interpolate`${this.bucket.arn}/*`
            }
          ]
        })
      },
      { dependsOn: [bucketPublicAccessBlock], parent: this }
    )

    this.registerOutputs({
      s3Web: this.s3Web
    })
  }

  get s3Web() {
    return pulumi.interpolate`http://${this.websiteEndpoint}`
  }
}
