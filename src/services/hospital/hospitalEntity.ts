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
          field: 'INST_ID',
          composite: ['INST_ID'],
          template: '${INST_ID}'
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
