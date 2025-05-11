import { GlobalConfig } from 'semantic-release'

const config: GlobalConfig = {
  branches: ['main'],
  repositoryUrl: 'https://github.com/Julooga/doctor_guide_api',
  tagFormat: '${version}',
  plugins: [
    '@semantic-release/commit-analyzer', // 커밋 메시지를 분석하여 버전 결정
    '@semantic-release/release-notes-generator', // CHANGELOG.md에 들어갈 릴리스 노트를 생성
    '@semantic-release/changelog', // CHANGELOG.md 업데이트
    // '@semantic-release/npm', // npm 배포
    '@semantic-release/github', // GitHub Release를 생성
    [
      '@semantic-release/git', //  Git 커밋 및 푸시
      {
        assets: ['CHANGELOG.md', 'package.json'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ]
  ]
}

export default config
