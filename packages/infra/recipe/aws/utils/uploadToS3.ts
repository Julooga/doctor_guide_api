import * as fs from 'fs'
import * as path from 'path'
import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import { Bucket } from '@pulumi/aws/s3'

// MIME 타입 매핑 함수
const getMimeType = (filePath: string): string | undefined => {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.xml': 'application/xml',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav'
  }

  return mimeTypes[ext]
}

// 캐시 제어 설정 함수
const getCacheControl = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase()

  // HTML 파일은 캐시하지 않음
  if (ext === '.html') {
    return 'no-cache, no-store, must-revalidate'
  }

  // 다른 모든 리소스는 무제한 캐시 (1년)
  return 'public, max-age=31536000, immutable'
}

const getPrefix = ({ item, prefix }: { item: string; prefix?: string }) => {
  if (prefix) {
    return `${prefix}/${item}`
  }

  return item
}

type Params = {
  pathname: string
  prefix?: string
  bucket: pulumi.Input<string | Bucket>
  parentResource?: pulumi.Resource
}

export const uploadToS3 = ({
  pathname,
  prefix,
  bucket,
  parentResource
}: Params) => {
  fs.readdirSync(pathname).forEach((item) => {
    const itemPath = path.join(pathname, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory()) {
      // 하위 디렉토리 재귀 처리
      uploadToS3({
        pathname: itemPath,
        prefix: getPrefix({ item, prefix }),
        bucket,
        parentResource
      })

      return
    }

    // 파일 업로드
    const key = getPrefix({ item, prefix })
    new aws.s3.BucketObjectv2(
      `${key.replace(/[/.]/g, '-')}`,
      {
        bucket,
        key: key,
        source: new pulumi.asset.FileAsset(itemPath),
        contentType: getMimeType(itemPath),
        cacheControl: getCacheControl(itemPath)
      },
      {
        parent: parentResource
      }
    )
  })
}
