import { z } from 'zod'
import 'zod-openapi/extend'

export const hospitalPoiSchema = z
  .object({
    INST_EXPLN_DTL: z.string().nullable().openapi({
      description: '기관설명상세'
    }),
    FIAI_MDLCR_INST_CD: z.string().nullable().openapi({
      description: '응급의료기관코드',
      example: 'G006'
    }),
    EMRO_TLHN: z.string().nullable().openapi({
      description: '응급실전화번호',
      example: '031-300-0119'
    }),
    MDEXM_HR_FRDY_C: z.string().nullable().openapi({
      description: '진료종료시간금요일',
      example: '1730'
    }),
    MDEXM_HR_WDDY_C: z.string().nullable().openapi({
      description: '진료종료시간수요일',
      example: '1730'
    }),
    HSPTL_CLSF_NM: z.string().nullable().openapi({
      description: '병원분류명',
      example: '종합병원'
    }),
    RPRS_TLHN_1: z.string().nullable().openapi({
      description: '대표전화번호',
      example: '031-300-0114'
    }),
    INST_ID: z.string().nullable().openapi({
      description: '기관아이디',
      example: 'A2100029'
    }),
    RMRK: z.string().nullable().openapi({
      description: '비고',
      example: '- 점심시간: 12시 30분 ~ 13시 30분'
    }),
    HSPTL_CLSF: z.string().nullable().openapi({
      description: '병원분류',
      example: 'A'
    }),
    MDEXM_HR_STDY_C: z.string().nullable().openapi({
      description: '진료종료시간토요일',
      example: '1230'
    }),
    YCRD: z.number().nullable().openapi({
      description: 'Y지도좌표',
      example: 4477337.182
    }),
    MDEXM_HR_MNDY_S: z.string().nullable().openapi({
      description: '진료시작시간월요일',
      example: '830'
    }),
    MDEXM_HR_TSDY_C: z.string().nullable().openapi({
      description: '진료종료시간화요일',
      example: '1730'
    }),
    MDEXM_HR_LHLDY_C: z.string().nullable().openapi({
      description: '진료종료시간공휴일'
    }),
    FIAI_MDLCR_INST_CD_NM: z.string().nullable().openapi({
      description: '응급의료기관코드명',
      example: '지역응급의료센터'
    }),
    INST_NM: z.string().nullable().openapi({
      description: '기관명',
      example: '강남병원'
    }),
    ZIP_2: z.string().nullable().openapi({
      description: '우편번호2',
      example: '64'
    }),
    GID: z.string().nullable().openapi({
      description: '기관고유번호',
      example: '139'
    }),
    MDEXM_HR_THDY_S: z.string().nullable().openapi({
      description: '진료시작시간목요일',
      example: '830'
    }),
    MDEXM_HR_STDY_S: z.string().nullable().openapi({
      description: '진료시작시간토요일',
      example: '830'
    }),
    ZIP_1: z.string().nullable().openapi({
      description: '우편번호1',
      example: '170'
    }),
    MDEXM_HR_MNDY_C: z.string().nullable().openapi({
      description: '진료종료시간월요일',
      example: '1730'
    }),
    HSPTL_LOT: z.number().nullable().openapi({
      description: '병원경도',
      example: 127.1114072
    }),
    MDEXM_HR_TSDY_S: z.string().nullable().openapi({
      description: '진료시작시간화요일',
      example: '830'
    }),
    ADDR: z.string().nullable().openapi({
      description: '주소',
      example: '경기도 용인시 기흥구 중부대로 411, 강남병원 (신갈동)'
    }),
    MDEXM_HR_SNDY_S: z.string().nullable().openapi({
      description: '진료시작시간일요일'
    }),
    MDEXM_HR_LHLDY_S: z.string().nullable().openapi({
      description: '진료시작시간공휴일'
    }),
    WKND_OPER_YN: z.string().nullable().openapi({
      description: '주말운영여부',
      example: 'N'
    }),
    MDEXM_HR_THDY_C: z.string().nullable().openapi({
      description: '진료종료시간목요일',
      example: '1730'
    }),
    XCRD: z.number().nullable().openapi({
      description: 'X지도좌표',
      example: 14149977.12
    }),
    MDEXM_HR_FRDY_S: z.string().nullable().openapi({
      description: '진료시작시간금요일',
      example: '830'
    }),
    ESNS_RGHMP: z.string().nullable().openapi({
      description: '간이약도'
    }),
    MDEXM_HR_WDDY_S: z.string().nullable().openapi({
      description: '진료시작시간수요일',
      example: '830'
    }),
    HSPTL_LAT: z.number().nullable().openapi({
      description: '병원위도',
      example: 37.27377984
    }),
    EMRO_OPER_YN_: z.string().nullable().openapi({
      description: '응급실운영여부',
      example: '1'
    }),
    MDEXM_HR_SNDY_C: z.string().nullable().openapi({
      description: '진료종료시간일요일'
    })
  })
  .openapi({ ref: 'HospitalPoiSchema' })

export type HospitalPoiSchemaType = z.infer<typeof hospitalPoiSchema>
