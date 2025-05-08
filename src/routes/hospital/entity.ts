import { Entity } from 'electrodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// DynamoDB 클라이언트 생성
const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

// 테이블 이름 정의
const TABLE_NAME = 'Hospital-safetydata'

/**
 * Hospital 엔티티 정의
 *
 * ElectroDB Entity를 사용하여 병원 데이터 모델 정의
 * schema.txt를 기반으로 INST_ID를 주 키로 사용
 */
export const HospitalEntity = new Entity(
  {
    // 모델 메타데이터 정의
    model: {
      entity: 'hospital',
      version: '1',
      service: 'doctorGuide'
    },
    // 속성 정의
    attributes: {
      // 주 키(Primary Key)로 사용되는 병원 ID
      INST_ID: {
        type: 'string',
        required: true
      },
      // 병원명
      name: {
        type: 'string'
      },
      // 주소
      address: {
        type: 'string'
      },
      // 전화번호
      tel: {
        type: 'string'
      },
      // 병원 유형
      type: {
        type: 'string'
      },
      // 설립일
      establishedDate: {
        type: 'string'
      },
      // 병상 수
      bedCount: {
        type: 'number'
      },
      // 의사 수
      doctorCount: {
        type: 'number'
      },
      // 진료과목 (문자열 배열)
      departments: {
        type: 'list',
        items: {
          type: 'string'
        }
      },
      // 위치 정보 (위도, 경도)
      location: {
        type: 'map',
        properties: {
          latitude: {
            type: 'number'
          },
          longitude: {
            type: 'number'
          }
        }
      },
      // 생성 일시
      createdAt: {
        type: 'string'
      },
      // 수정 일시
      updatedAt: {
        type: 'string',
        watch: '*', // 다른 필드가 변경될 때마다 자동 업데이트
        set: () => new Date().toISOString()
      }
    },
    // 인덱스 정의
    indexes: {
      // 기본 인덱스: INST_ID를 파티션 키로 사용
      primary: {
        pk: {
          field: 'pk',
          composite: ['INST_ID']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      }
    }
  },
  {
    // 테이블 이름과 DynamoDB 클라이언트 설정
    table: TABLE_NAME,
    client: docClient
  }
)

/**
 * Hospital 엔티티의 타입 추출
 * 이 타입은 ElectroDB 엔티티에서 자동으로 생성된 타입으로,
 * 애플리케이션에서 병원 데이터를 다룰 때 사용할 수 있습니다.
 */
export type HospitalEntityType = typeof HospitalEntity.schema.attributes

/**
 * 병원 검색 파라미터 타입
 */
export type HospitalSearchParams = {
  /** 병원 ID로 검색 */
  INST_ID?: string
  /** 병원명으로 검색 */
  name?: string
  /** 주소로 검색 */
  address?: string
  /** 병원 유형으로 검색 */
  type?: string
  /** 페이지네이션: 페이지 번호 */
  page?: number
  /** 페이지네이션: 페이지 크기 */
  limit?: number
}
