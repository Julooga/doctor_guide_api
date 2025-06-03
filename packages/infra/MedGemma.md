AWS Bedrock에서 MedGemma를 사용하는 방법:

AWS 계정: 먼저 AWS 계정이 있어야 합니다.
Amazon Bedrock 콘솔 접속: AWS Bedrock 콘솔로 이동합니다.
모델 카탈로그 (Model catalog): 왼쪽 탐색 창에서 "Foundation models" 아래의 "Model catalog"를 선택합니다.
Gemma 모델 검색: 공급자(Provider) 필터에서 "Gemma"를 선택하고, "Gemma 3 27B Instruct" 모델을 찾습니다. (MedGemma 4B multimodal 모델의 가용성은 별도로 확인이 필요할 수 있습니다. 현재 Bedrock에서 공식적으로 제공되는 Gemma 모델은 주로 텍스트 기반 모델인 Gemma 3 27B Instruct입니다.)
모델 액세스 요청: 해당 모델에 대한 액세스를 요청합니다.
모델 배포 및 사용: 모델 액세스가 승인되면 Amazon Bedrock API (Invoke 및 Converse)를 사용하여 모델을 호출할 수 있습니다. 또한, Amazon Bedrock Knowledge Bases, Amazon Bedrock Agents, Amazon Bedrock Flows 등 Bedrock의 다양한 기능을 활용하여 MedGemma를 기반으로 한 의료 AI 애플리케이션을 구축할 수 있습니다.