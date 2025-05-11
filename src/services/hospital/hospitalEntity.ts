import { Entity } from 'electrodb'
import { docClient } from '@/services/client'

// 테이블 이름 정의
const TABLE_NAME = 'Hospital-safetydata'

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
    attributes: {
      // 주 키(Primary Key)로 사용되는 병원 ID
      INST_ID: {
        type: 'string',
        required: true
      },
      // 일련번호
      SN: {
        type: 'string',
        required: true
      },
      // 주소
      ADDR: {
        type: 'string',
        required: true
      },
      // 병원분류코드
      HSPTL_CLSF_CD: {
        type: 'string',
        required: true
      },
      // 병원분류명
      HSPTL_CLSF_NM: {
        type: 'string',
        required: true
      },
      // 응급의료기관코드
      FIAI_MDLCR_INST_CD: {
        type: 'string',
        required: true
      },
      // 응급의료기관코드명
      FIAI_MDLCR_INST_CD_NM: {
        type: 'string',
        required: true
      },
      // 응급실운영여부
      EMRO_OPER_YN: {
        type: 'string',
        required: true
      },
      // 응급실운영여부 (언더스코어 포함 버전)
      EMRO_OPER_YN_: {
        type: 'string'
      },
      // 비고
      RMRK: {
        type: 'string'
      },
      // 간이
      ESNS: {
        type: 'string'
      },
      // 간이약도
      ESNS_RGHMP: {
        type: 'string'
      },
      // 기관명
      INST_NM: {
        type: 'string',
        required: true
      },
      // 기관설명상세
      INST_EXPLN_DTL: {
        type: 'string'
      },
      // 대표전화번호
      RPRS_TELNO: {
        type: 'string',
        required: true
      },
      // 대표전화번호 (다른 형식)
      RPRS_TLHN_1: {
        type: 'string'
      },
      // 응급실전화번호
      EMRO_TELNO: {
        type: 'string'
      },
      // 응급실전화번호 (다른 형식)
      EMRO_TLHN: {
        type: 'string'
      },
      // 진료종료시간월요일
      MDEXM_END_HR_MNDY: {
        type: 'string'
      },
      // 진료종료시간월요일 (다른 형식)
      MDEXM_HR_MNDY_C: {
        type: 'string'
      },
      // 진료종료시간화요일
      MDEXM_END_HR_TSDY: {
        type: 'string'
      },
      // 진료종료시간화요일 (다른 형식)
      MDEXM_HR_TSDY_C: {
        type: 'string'
      },
      // 진료종료시간수요일
      MDEXM_END_HR_WDDY: {
        type: 'string'
      },
      // 진료종료시간수요일 (다른 형식)
      MDEXM_HR_WDDY_C: {
        type: 'string'
      },
      // 진료종료시간목요일
      MDEXM_END_HR_THDY: {
        type: 'string'
      },
      // 진료종료시간목요일 (다른 형식)
      MDEXM_HR_THDY_C: {
        type: 'string'
      },
      // 진료종료시간금요일
      MDEXM_END_HR_FRDY: {
        type: 'string'
      },
      // 진료종료시간금요일 (다른 형식)
      MDEXM_HR_FRDY_C: {
        type: 'string'
      },
      // 진료종료시간토요일
      MDEXM_END_HR_STDY: {
        type: 'string'
      },
      // 진료종료시간토요일 (다른 형식)
      MDEXM_HR_STDY_C: {
        type: 'string'
      },
      // 진료종료시간일요일
      MDEXM_END_HR_SNDY: {
        type: 'string'
      },
      // 진료종료시간일요일 (다른 형식)
      MDEXM_HR_SNDY_C: {
        type: 'string'
      },
      // 진료종료시간공휴일
      MDEXM_END_HR_LHLDY: {
        type: 'string'
      },
      // 진료종료시간공휴일 (다른 형식)
      MDEXM_HR_LHLDY_C: {
        type: 'string'
      },
      // 진료시작시간월요일
      MDEXM_BGNG_HR_MNDY: {
        type: 'string'
      },
      // 진료시작시간월요일 (다른 형식)
      MDEXM_HR_MNDY_S: {
        type: 'string'
      },
      // 진료시작시간화요일
      MDEXM_BGNG_HR_TSDY: {
        type: 'string'
      },
      // 진료시작시간화요일 (다른 형식)
      MDEXM_HR_TSDY_S: {
        type: 'string'
      },
      // 진료시작시간수요일
      MDEXM_BGNG_HR_WDDY: {
        type: 'string'
      },
      // 진료시작시간수요일 (다른 형식)
      MDEXM_HR_WDDY_S: {
        type: 'string'
      },
      // 진료시작시간목요일
      MDEXM_BGNG_HR_THDY: {
        type: 'string'
      },
      // 진료시작시간목요일 (다른 형식)
      MDEXM_HR_THDY_S: {
        type: 'string'
      },
      // 진료시작시간금요일
      MDEXM_BGNG_HR_FRDY: {
        type: 'string'
      },
      // 진료시작시간금요일 (다른 형식)
      MDEXM_HR_FRDY_S: {
        type: 'string'
      },
      // 진료시작시간토요일
      MDEXM_BGNG_HR_STDY: {
        type: 'string'
      },
      // 진료시작시간토요일 (다른 형식)
      MDEXM_HR_STDY_S: {
        type: 'string'
      },
      // 진료시작시간일요일
      MDEXM_BGNG_HR_SNDY: {
        type: 'string'
      },
      // 진료시작시간일요일 (다른 형식)
      MDEXM_HR_SNDY_S: {
        type: 'string'
      },
      // 진료시작시간공휴일
      MDEXM_BGNG_HR_LHLDY: {
        type: 'string'
      },
      // 진료시작시간공휴일 (다른 형식)
      MDEXM_HR_LHLDY_S: {
        type: 'string'
      },
      // 우편번호1
      ZIP_1: {
        type: 'string'
      },
      // 우편번호2
      ZIP_2: {
        type: 'string'
      },
      // 기관설명상세경도
      INST_EXPLN_DTL_LOT: {
        type: 'string'
      },
      // 경도위도
      LOT_LAT: {
        type: 'string'
      },
      // 병원경도
      HSPTL_LOT: {
        type: 'number'
      },
      // 위도
      LAT: {
        type: 'string'
      },
      // 병원위도
      HSPTL_LAT: {
        type: 'number'
      },
      // X지도좌표
      XMAP_CRTS: {
        type: 'string'
      },
      // X좌표 (다른 형식)
      XCRD: {
        type: 'number'
      },
      // Y지도좌표
      YMAP_CRTS: {
        type: 'string'
      },
      // Y좌표 (다른 형식)
      YCRD: {
        type: 'number'
      },
      // 주말진료여부
      WKND_MDEXM_YN: {
        type: 'string'
      },
      // 주말운영여부
      WKND_OPER_YN: {
        type: 'string'
      },
      // 병원분류
      HSPTL_CLSF: {
        type: 'string'
      },
      // 기관고유번호
      GID: {
        type: 'string'
      },
      // 지오메트리
      GEOM: {
        type: 'any'
      }
    },
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
    table: TABLE_NAME,
    client: docClient
  }
)

export default hospitalEntity
