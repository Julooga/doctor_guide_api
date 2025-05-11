## [1.0.8](https://github.com/Julooga/doctor_guide_api/compare/1.0.7...1.0.8) (2025-05-11)


### Bug Fixes

* GitHub 저장소 URL 생성 로직 수정 및 잘못된 경로 수정 ([e1783fb](https://github.com/Julooga/doctor_guide_api/commit/e1783fba7d4597d1e445194779cfc11c5a08135b))
* 각 워크플로우에서 install 작업의 의존성 추가 ([00aa0b9](https://github.com/Julooga/doctor_guide_api/commit/00aa0b90b477d741913498046ebd63ce5b4e53dc))

## [1.0.7](https://github.com/Julooga/doctor_guide_api/compare/1.0.6...1.0.7) (2025-05-11)


### Bug Fixes

* README.md에서 semantic-release 배지의 텍스트 수정 ([d2d66c2](https://github.com/Julooga/doctor_guide_api/commit/d2d66c2c6f52514463b460852a541219d9429c9b))

## [1.0.6](https://github.com/Julooga/doctor_guide_api/compare/1.0.5...1.0.6) (2025-05-11)


### Bug Fixes

* lambda:cleanup 스크립트에서 lambda-update.log 파일 제거 ([205f9f1](https://github.com/Julooga/doctor_guide_api/commit/205f9f112ff175eca22ef5cce4c31d4018b7a906))

## [1.0.5](https://github.com/Julooga/doctor_guide_api/compare/1.0.4...1.0.5) (2025-05-11)


### Bug Fixes

* '@semantic-release/npm' 플러그인 추가 및 주석 수정 ([ce4c68a](https://github.com/Julooga/doctor_guide_api/commit/ce4c68a3f893f740dd9081c3f1a791526f9e6f90))
* package.json 버전 1.0.0에서 1.0.4로 업데이트 ([2fdbfd8](https://github.com/Julooga/doctor_guide_api/commit/2fdbfd8dc9b75854fea0d8d9fab64c7016143d66))

## [1.0.4](https://github.com/Julooga/doctor_guide_api/compare/1.0.3...1.0.4) (2025-05-11)


### Bug Fixes

* pre-commit 스크립트에 lambda:cleanup 추가 및 배포 스크립트 수정 ([9a38d03](https://github.com/Julooga/doctor_guide_api/commit/9a38d038ab7a17431e7010be6a1e551aeabf647d))

## [1.0.3](https://github.com/Julooga/doctor_guide_api/compare/1.0.2...1.0.3) (2025-05-11)


### Bug Fixes

* AWS Lambda 업데이트 명령어에 지역 파라미터 추가 ([9999047](https://github.com/Julooga/doctor_guide_api/commit/999904710de42c4452abe6474dcd094aa0d51b74))

## [1.0.2](https://github.com/Julooga/doctor_guide_api/compare/1.0.1...1.0.2) (2025-05-11)


### Bug Fixes

* 워크플로우 트리거를 수정하여 일관성 유지 ([9e10702](https://github.com/Julooga/doctor_guide_api/commit/9e1070243d5742e651e4653148f4ac809b67b882))

## [1.0.1](https://github.com/Julooga/doctor_guide_api/compare/v1.0.0...1.0.1) (2025-05-11)


### Bug Fixes

* tagFormat에서 'v' 접두사 제거 ([3e000cd](https://github.com/Julooga/doctor_guide_api/commit/3e000cddb3ee9163a5435bddecf1df7daf0ec7e1))

# 1.0.0 (2025-05-11)


### Bug Fixes

* .env.example 파일 삭제하여 불필요한 자격 증명 정보 제거 ([2c8bc1c](https://github.com/Julooga/doctor_guide_api/commit/2c8bc1c1dcf2626544c84037689f5a0f0afd39c2))
* .gitignore에 sdk/api.ts 추가 및 해당 파일 삭제 ([4b8f77c](https://github.com/Julooga/doctor_guide_api/commit/4b8f77cdfce6652cb266e880a1d6ba4a4337bd8c))
* .gitignore에서 .vscode 디렉토리 제외 규칙 수정 및 README.md 배포 명령어 수정 ([a82bfea](https://github.com/Julooga/doctor_guide_api/commit/a82bfea9dbdbff300fc1d3230b882b571916f419))
* AWS Lambda 배포 스크립트에서 푸시 트리거 주석 처리 ([d6474f9](https://github.com/Julooga/doctor_guide_api/commit/d6474f9c13142ed8ce1189fba622f66e73e498da))
* AWS Lambda 배포 스크립트의 권한 설정 수정 및 세션 토큰 제거 ([9f67fd6](https://github.com/Julooga/doctor_guide_api/commit/9f67fd61a9ad61844ff0feb437e77d046745b563))
* aws lambda 업데이트 스크립트에서 출력 리디렉션 추가 및 API 빌드 경로 수정 ([392c423](https://github.com/Julooga/doctor_guide_api/commit/392c423bf3d64e309f47f2e7a0efca2984e425ba))
* AWS 자격 증명 구성에 세션 토큰 추가 ([4fef65e](https://github.com/Julooga/doctor_guide_api/commit/4fef65e07bfa4ef3bcee5d0256ef820764622d1e))
* build:api 스크립트의 출력 경로를 ./dist로 수정 ([39c0822](https://github.com/Julooga/doctor_guide_api/commit/39c08222df96c66baa997eed986a8570c609fe0d))
* deploy:lambda 스크립트 이름을 deploy:lambda:local로 변경 ([2944c12](https://github.com/Julooga/doctor_guide_api/commit/2944c12d4a922219e5abe48d8955fd2eb55c5ddf))
* GitHub Actions 워크플로우에서 주석 처리된 push 이벤트 복원 ([240dfee](https://github.com/Julooga/doctor_guide_api/commit/240dfee30fc8326f2ecc1b2b4274aeda7a4e443a))
* GitHub Packages에 게시할 때 레지스트리 URL 추가 ([554d047](https://github.com/Julooga/doctor_guide_api/commit/554d04737b0bff128a5bcc118a14e090b811fe63))
* hospital 및 pharmacy 라우트에서 요청 스키마를 수정하고 nullable을 제거하여 데이터 유효성 개선 ([6051260](https://github.com/Julooga/doctor_guide_api/commit/605126032ac1b5e513d4ff7b1fd5941e7aff45e7))
* hospitalPoiModel을 hospitalPoiSchema로 변경하여 일관성 유지 ([963a451](https://github.com/Julooga/doctor_guide_api/commit/963a4517126b5daec0ab0ec7db3f3b95344e80e4))
* hospitalPoiReqSchema의 numOfRows 및 pageNo 타입을 string으로 변경하고 예제 값을 수정 ([e79d48e](https://github.com/Julooga/doctor_guide_api/commit/e79d48eb8ea161ed2211b748753940045e865ff4))
* hospitalPoiReqSchema의 numOfRows 예제 값을 10에서 1로 수정 ([66d2342](https://github.com/Julooga/doctor_guide_api/commit/66d23425b7ee1e7148eb901434fb2c0aa0bc84db))
* hospitalPoiSchema를 HospitalPoiModel로 변경하여 일관성 유지 ([05a6d3a](https://github.com/Julooga/doctor_guide_api/commit/05a6d3a54bf0cedd1ff7fd4250c204cb1f58c54a))
* npm 배포 플러그인 주석 처리 ([cac6f5d](https://github.com/Julooga/doctor_guide_api/commit/cac6f5d3b0b6e79146e0e6a6471328ceb7e3fa11))
* null 값을 문자열에서 실제 null로 변경 및 데이터 타입 수정 ([5c65d0b](https://github.com/Julooga/doctor_guide_api/commit/5c65d0b07c1be625f34396c613728c2510d13df1))
* package.json에서 버전 정보 추가 및 app.ts에서 동적으로 사용 ([359e289](https://github.com/Julooga/doctor_guide_api/commit/359e289cc0af356f427c5639f393e675634ad0b5))
* package.json의 dev 스크립트를 watch 모드로 변경하고, schema.ts에서 주소 예제 값을 제거 ([ca0de7b](https://github.com/Julooga/doctor_guide_api/commit/ca0de7b5ebb293305ae0402da52080d5d55ca4d1))
* Publish 단계에서 dist 디렉토리로 이동 후 패키지 게시 ([a8cd4c9](https://github.com/Julooga/doctor_guide_api/commit/a8cd4c941f63670082a9f70504602ec4c97762e3))
* README.md에서 배포 명령어를 수정하여 AWS Lambda 배포로 변경 ([c708c46](https://github.com/Julooga/doctor_guide_api/commit/c708c4616d6a3e727abb624aecd67c22516a1dae))
* SDK 버전 업데이트 시 임시 파일 경로 수정 ([ab07bf0](https://github.com/Julooga/doctor_guide_api/commit/ab07bf0211d6ca4c0695befdbb6704e96bc70f9c))
* semantic-release 작업 이름 수정 및 실행 명령 간소화 ([c6ab8bc](https://github.com/Julooga/doctor_guide_api/commit/c6ab8bc7e85faeec5ff809619f0130d0732aa492))
* wrangler.jsonc의 이름을 doctor_guide_api로 변경 및 주석 처리된 서버 설정 코드 정리 ([57a71ba](https://github.com/Julooga/doctor_guide_api/commit/57a71bab3a8107f0dbdb3c2e63d17617176856f8))
* zod2ElectroAttributes 컨버터 주석 수정 ([d885799](https://github.com/Julooga/doctor_guide_api/commit/d88579912f49ddfae00d7664452f99177490c3b2))
* 누락된 키워드 및 오타 수정으로 AWS Lambda 배포 스크립트 개선 ([b2ad6fc](https://github.com/Julooga/doctor_guide_api/commit/b2ad6fca2b2132a7b7622a36319330c3b81207c0))
* 문자열 따옴표 스타일을 일관되게 수정 ([ecea45a](https://github.com/Julooga/doctor_guide_api/commit/ecea45a155fc2742aa73a29de5e77ccb8bcdc5ca))
* 서버 반환 순서 수정하여 프로덕션 환경에서의 서버 목록 정리 ([4e25e23](https://github.com/Julooga/doctor_guide_api/commit/4e25e23748d9f48c8ab4e97d2cdf73dcc2aaa5b7))
* 수정된 AWS Lambda 배포 스크립트의 누락된 키워드 및 오타 수정 ([053dc82](https://github.com/Julooga/doctor_guide_api/commit/053dc8262a52a08b402b31bf793a39f408a9b3b3))
* 수정된 npm 플러그인 설정 및 package.json 경로 업데이트 ([b132b39](https://github.com/Julooga/doctor_guide_api/commit/b132b397ed72478ad6c8925b8c16a5445196808a))
* 요청 스키마에서 nullable을 optional로 변경하여 데이터 유효성 개선 ([9543003](https://github.com/Julooga/doctor_guide_api/commit/9543003e1ee66ff3ff6fa2311279f5e293c4eaf5))
* 요청 스키마에서 userName을 쿼리로 변경하고 병원 데이터 및 약국 데이터 추가 ([5341347](https://github.com/Julooga/doctor_guide_api/commit/534134791a46add398c74467709722ddd55b552c))
* 주석 처리된 패치 버전 증가 단계 제거 ([1a9c69f](https://github.com/Julooga/doctor_guide_api/commit/1a9c69feffdb1de7786d90f5e43d13597814ea3b))
* 패치 버전 증가 스크립트에서 잘못된 경로 수정 ([2dcc01c](https://github.com/Julooga/doctor_guide_api/commit/2dcc01c7db85585787cb389dff990105d12a50f8))


### Features

* .npmrc 파일 추가 및 GitHub 패키지 레지스트리 설정 ([3d32940](https://github.com/Julooga/doctor_guide_api/commit/3d3294086829bccc5841f2be4a53733105052267))
* .vscode 디렉토리에 설정 파일 추가 (extensions.json, mcp.json, settings.json) ([f440625](https://github.com/Julooga/doctor_guide_api/commit/f440625650caf0555bb3ccffedac951347ffc2c0))
* add DynamoDB client for remote and local usage ([709923d](https://github.com/Julooga/doctor_guide_api/commit/709923d3842342da2bf24caecdbe254b211c2c98))
* add hospital and pharmacy schemas, entities, and mock data ([f0993a3](https://github.com/Julooga/doctor_guide_api/commit/f0993a384d20e50e192a6cf0168e1f1c08b92273))
* Add hospital and pharmacy services with mock data and schema definitions ([c84c887](https://github.com/Julooga/doctor_guide_api/commit/c84c887bac2162d3044a63808c4e01ba79c8a978))
* add logger middleware and create development server ([1d3653e](https://github.com/Julooga/doctor_guide_api/commit/1d3653ec7458bc8905e941c90f8a6a0381765d0b))
* add Prettier configuration, Hono server setup, and TypeScript configuration ([b11ba6e](https://github.com/Julooga/doctor_guide_api/commit/b11ba6e65e2b69037dc3ddcc34a35cf4cddf1278))
* AWS Lambda 배포 및 SDK 게시 워크플로우 수정 ([5450d80](https://github.com/Julooga/doctor_guide_api/commit/5450d805d146ff85d4efcadd30219915dd50c407))
* AWS Lambda 배포 스크립트 추가 및 package.json 수정 ([b4493d1](https://github.com/Julooga/doctor_guide_api/commit/b4493d121456e765cab73374ac432b3c1fd2bdf1))
* AWS SDK 자격 증명 제공자 추가 및 DynamoDB 클라이언트 설정 수정 ([f42d343](https://github.com/Julooga/doctor_guide_api/commit/f42d343873cb0d684b97e90bc27f36d0b8efa22e))
* createListDataSchema 및 createSuccessSchema에 OpenAPI 참조 추가 ([b727a5c](https://github.com/Julooga/doctor_guide_api/commit/b727a5c0dda77549608745efd334516f6297ff72))
* dotenv 패키지 추가하여 환경 변수 로드 기능 구현 ([33cc993](https://github.com/Julooga/doctor_guide_api/commit/33cc99395946ea7a292e06b1b026743ad6a7d49e))
* DynamoDB 클라이언트 및 Zod 속성 처리 기능 추가 ([a77a243](https://github.com/Julooga/doctor_guide_api/commit/a77a2434679e286d4470f6f0f715c62c85abe817))
* GitHub Actions 워크플로우 추가하여 SDK를 GitHub Packages에 배포 ([4ea8f2f](https://github.com/Julooga/doctor_guide_api/commit/4ea8f2fb081e8260058c0eeac018277d56367e26))
* GitHub Actions에서 패키지 게시를 위한 권한 설정 추가 ([7f4b089](https://github.com/Julooga/doctor_guide_api/commit/7f4b0890d540b51f2ed28c60532d35f2864e4362))
* GitHub 워크플로우에 대한 README 이미지 추가 ([eecfb8c](https://github.com/Julooga/doctor_guide_api/commit/eecfb8c089c0d69d52b620736b95044923b2b5e0))
* Implement hospital and pharmacy routes with OpenAPI integration ([b269d48](https://github.com/Julooga/doctor_guide_api/commit/b269d4831b3e48f37bd620ba921a09d973935f0c))
* launch.json 파일 추가 및 디버거 구성 설정 ([14670e3](https://github.com/Julooga/doctor_guide_api/commit/14670e37bd257877decd47772e4ea50a5f1c2c87))
* OpenAPIHono 및 Swagger UI 통합, 병원 정보 라우트 추가 및 성공 응답 스키마 생성 ([5d3644c](https://github.com/Julooga/doctor_guide_api/commit/5d3644c4f6b96ab06d670d604ad0520d8cfa05f2))
* pnpm 설치 단계 추가 및 Node.js 설정 개선 ([e544315](https://github.com/Julooga/doctor_guide_api/commit/e54431597e2e7e950ad8c8be70539441c289260e))
* sdk 디렉토리에 .npmrc 파일 생성 및 publish 단계에서 레지스트리 플래그 생략 ([f057a54](https://github.com/Julooga/doctor_guide_api/commit/f057a54f6e564c0ff3814c4b0c0a8e6d1f26a081))
* SDK 버전 증가 스크립트 활성화 및 wrangler.jsonc 파일 삭제 ([52f273c](https://github.com/Julooga/doctor_guide_api/commit/52f273cf6159ae692eb5aa8976d1aeed757c75e9))
* SDK 패키지 및 API 정의 추가 ([5879950](https://github.com/Julooga/doctor_guide_api/commit/5879950c9f58fa537b7b96b0788872fba6c78a6c))
* secureHeaders 미들웨어 추가 ([49d2b1b](https://github.com/Julooga/doctor_guide_api/commit/49d2b1b52932df46ad973a0058f7fc8dbbe4a8fb))
* update AWS Lambda deployment script and add new dependencies ([ac8f7cd](https://github.com/Julooga/doctor_guide_api/commit/ac8f7cde7b1ed854d85ed232f99396c08d90d741))
* update README and package.json to include engine requirements ([8737355](https://github.com/Julooga/doctor_guide_api/commit/8737355e83d79f0d462213ad3779ba7267ccf40f))
* Zod 스키마 처리 개선을 위한 unwrapSchema 함수 추가 ([16808a0](https://github.com/Julooga/doctor_guide_api/commit/16808a007efd96eb084e32c1578da10f78c4b10e))
* Zod 스키마를 일렉트로DB 애뜨리뷰트로 변환하는 컨버터 구현 ([e2b40b3](https://github.com/Julooga/doctor_guide_api/commit/e2b40b36de221ef7bfc3ad34e65ca0dca14aab3c))
* 병원 및 약국 API 스키마 및 라우트 수정, zod-validator로 전환 ([6bb044e](https://github.com/Julooga/doctor_guide_api/commit/6bb044ed9a4ea28d94cdc6afd532276581f32950))
* 병원 및 약국 API 쿼리 조건 추가 및 스키마 수정 ([68fc9ec](https://github.com/Julooga/doctor_guide_api/commit/68fc9ec6061712c77159c7719844c53fd7319c56))
* 병원 및 약국 POI 모델 스키마 업데이트 및 라우트 수정 ([ec2b1b9](https://github.com/Julooga/doctor_guide_api/commit/ec2b1b96001e24d066208a5380505f8d63516204))
* 병원 및 약국 POI 스키마 및 엔티티 정의 추가 ([faa2084](https://github.com/Julooga/doctor_guide_api/commit/faa20843379fca5877838886055aa408ded46c74))
* 병원 및 약국 관련 엔티티, 서비스 및 스키마 추가 ([e9adffe](https://github.com/Julooga/doctor_guide_api/commit/e9adffe0b686e2382169a5e994510bae6bef2e9e))
* 병원 및 약국 데이터 가져오기 기능 개선 및 스키마 업데이트 ([4c42277](https://github.com/Julooga/doctor_guide_api/commit/4c42277dbc08a585211e691fc3b4a30b5ea63f1f))
* 병원 및 약국 데이터 가져오기 기능 추가 및 AWS 리소스 문서화 ([60723f5](https://github.com/Julooga/doctor_guide_api/commit/60723f5987bc18dca7a0c1106db2315445fc6081))
* 병원 및 약국 라우트에 대한 설명 문서 추가 ([a08f338](https://github.com/Julooga/doctor_guide_api/commit/a08f338b44275f213f6cee8aca3d7a74da717847))
* 병원 및 약국 요청 스키마의 변수 이름을 소문자로 변경하여 일관성 유지 ([0c2caa9](https://github.com/Julooga/doctor_guide_api/commit/0c2caa9421f2f959bd255996f86620324affa604))
* 스크립트 명칭 수정 및 API 스키마 참조 타입 추가로 일관성 유지 ([5fb6541](https://github.com/Julooga/doctor_guide_api/commit/5fb6541b9feab7e3ede2009c835ed5340d9ac3d3))
* 약국 정보 라우트 추가 및 요청/응답 스키마 정의 ([a6022e8](https://github.com/Julooga/doctor_guide_api/commit/a6022e8ecc058aff64ec5e95dd3249854f3b0299))
* 워크플로우 트리거를 push에서 workflow_run으로 변경 ([3cb60f9](https://github.com/Julooga/doctor_guide_api/commit/3cb60f9547d944ffc0255041eeca61b5bebfa488))
* 응답 스키마에서 'items'를 'list'로 변경하여 일관성 유지 ([01ef4eb](https://github.com/Julooga/doctor_guide_api/commit/01ef4ebf6158002e2f2eaacc121933a2bf9ccb39))
* 일렉트로 DB 통합 초안을 구현 ([cdddd00](https://github.com/Julooga/doctor_guide_api/commit/cdddd004d3cba63aefdfcd79a9ff47779fa28e1f))
* 패치 버전 자동 증가 기능 추가 ([08a3761](https://github.com/Julooga/doctor_guide_api/commit/08a37613a9074c66f45d119986a00ce5afbaf7f0))
