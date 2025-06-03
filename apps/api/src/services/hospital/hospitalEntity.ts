import { Entity } from 'electrodb'
import { docClient } from '@/services/client'
import zod2ElectroAttributes from '../zodSchema2ElectroAttributes'
import hospitalPoiSchema from './hospitalPoiSchema'

const attributes = zod2ElectroAttributes(hospitalPoiSchema)

/**
 * Hospital 엔티티 정의
 *
 * ElectroDB Entity를 사용하여 병원 데이터 모델 정의
 * schema.txt를 기반으로 INST_ID를 주 키로 사용
 */
const hospitalEntity = new Entity(
  {
    // 모델 메타데이터 정의
    model: {
      entity: 'hospital',
      version: '1',
      service: 'doctorGuide'
    },
    // 속성 정의
    attributes,
    indexes: {
      primary: {
        pk: {
          field: 'pk',
          composite: ['INST_ID']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      classification: {
        index: 'hospital-classification-index',
        pk: {
          field: 'HSPTL_CLSF_NM',
          composite: ['HSPTL_CLSF_NM']
        },
        sk: {
          field: 'INST_NM',
          composite: ['INST_NM']
        }
      },
      name: {
        index: 'hospital-name-index',
        pk: {
          field: 'INST_NM',
          composite: ['INST_NM']
        }
      },
      emergency: {
        index: 'emergency-room-index',
        pk: {
          field: 'EMRO_OPER_YN_',
          composite: ['EMRO_OPER_YN_']
        },
        sk: {
          field: 'HSPTL_CLSF_NM',
          composite: ['HSPTL_CLSF_NM']
        }
      },
      region: {
        index: 'region-index',
        pk: {
          field: 'ADDR_REGION',
          composite: ['ADDR_REGION']
        },
        sk: {
          field: 'INST_NM',
          composite: ['INST_NM']
        }
      }
    }
  },
  {
    // 테이블 이름과 DynamoDB 클라이언트 설정
    table: 'Hospital-safetydata',
    client: docClient
  }
)

export default hospitalEntity
