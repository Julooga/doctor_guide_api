import { z } from '@hono/zod-openapi'

export const pharmacyPoiModel = z
  .object({
    MDEXM_END_HR_THDY: z.string().nullable().openapi({
      description: '진료종료시간목요일',
      example: '2000'
    }),
    INST_EXPLN_DTL: z.string().nullable().openapi({
      description: '기관설명상세',
      example: null
    }),
    MDEXM_BGNG_HR_STDY: z.string().nullable().openapi({
      description: '진료시작시간토요일',
      example: '1000'
    }),
    MDEXM_BGNG_HR_MNDY: z.string().nullable().openapi({
      description: '진료시작시간월요일',
      example: '1000'
    }),
    MDEXM_BGNG_HR_SNDY: z.string().nullable().openapi({
      description: '진료시작시간일요일',
      example: null
    }),
    INST_ID: z.string().nullable().openapi({
      description: '기관아이디',
      example: 'C2800751'
    }),
    MDEXM_END_HR_MNDY: z.string().nullable().openapi({
      description: '진료종료시간월요일',
      example: '2000'
    }),
    RMRK: z.string().nullable().openapi({
      description: '비고',
      example: null
    }),
    ESNS: z.string().nullable().openapi({
      description: '간이',
      example: '웅상지구대'
    }),
    MDEXM_END_HR_STDY: z.string().nullable().openapi({
      description: '진료종료시간토요일',
      example: '2000'
    }),
    MDEXM_END_HR_WDDY: z.string().nullable().openapi({
      description: '진료종료시간수요일',
      example: '2000'
    }),
    SN: z.number().nullable().openapi({
      description: '일련번호',
      example: 234
    }),
    MDEXM_END_HR_SNDY: z.string().nullable().openapi({
      description: '진료종료시간일요일',
      example: null
    }),
    GEOM: z.string().nullable().openapi({
      description: '지오메트리',
      example: 'POINT(14379397.96265367 4220567.7607631003)'
    }),
    MDEXM_BGNG_HR_THDY: z.string().nullable().openapi({
      description: '진료시작시간목요일',
      example: '1000'
    }),
    INST_NM: z.string().nullable().openapi({
      description: '기관명',
      example: '명동약국'
    }),
    ZIP_2: z.string().nullable().openapi({
      description: '우편번호2',
      example: '32'
    }),
    MDEXM_BGNG_HR_TSDY: z.string().nullable().openapi({
      description: '진료시작시간화요일',
      example: '1000'
    }),
    WKND_MDEXM_YN: z.string().nullable().openapi({
      description: '주말진료여부',
      example: 'Y'
    }),
    ZIP_1: z.string().nullable().openapi({
      description: '우편번호1',
      example: '505'
    }),
    MDEXM_BGNG_HR_LHLDY: z.string().nullable().openapi({
      description: '진료시작시간공휴일',
      example: '1000'
    }),
    MDEXM_END_HR_FRDY: z.string().nullable().openapi({
      description: '진료종료시간금요일',
      example: '2000'
    }),
    ADDR: z.string().nullable().openapi({
      description: '주소',
      example: '경상남도 양산시 대운로 181, 1층 (명동)'
    }),
    MDEXM_BGNG_HR_FRDY: z.string().nullable().openapi({
      description: '진료시작시간금요일',
      example: '1000'
    }),
    LOT: z.number().nullable().openapi({
      description: '경도',
      example: 129.1723296629
    }),
    YMAP_CRTS: z.number().nullable().openapi({
      description: 'Y지도좌표',
      example: 4220567.7607631
    }),
    RPRS_TELNO: z.string().nullable().openapi({
      description: '대표전화번호',
      example: '055-365-2584'
    }),
    MDEXM_END_HR_TSDY: z.string().nullable().openapi({
      description: '진료종료시간화요일',
      example: '2000'
    }),
    MDEXM_END_HR_LHLDY: z.string().nullable().openapi({
      description: '진료종료시간공휴일',
      example: '2000'
    }),
    MDEXM_BGNG_HR_WDDY: z.string().nullable().openapi({
      description: '진료시작시간수요일',
      example: '1000'
    }),
    XMAP_CRTS: z.number().nullable().openapi({
      description: 'X지도좌표',
      example: 14379397.962653672
    }),
    LAT: z.number().nullable().openapi({
      description: '위도',
      example: 35.4160672505
    })
  })
  .openapi('PharmacyPoiModel')
