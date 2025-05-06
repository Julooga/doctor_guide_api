import { z } from '@hono/zod-openapi'

export const reqSchema = z
  .object({
    userName: z.string().optional().openapi({
      example: '홍길동',
      description: '사용자의 이름'
    })
  })
  .openapi('HospitalRequest')

export const pharmacyPoiSchema = z.object({
  MDEXM_END_HR_THDY: z.string().nullable(),
  INST_EXPLN_DTL: z.string().nullable(),
  MDEXM_BGNG_HR_STDY: z.string().nullable(),
  MDEXM_BGNG_HR_MNDY: z.string().nullable(),
  MDEXM_BGNG_HR_SNDY: z.string().nullable(),
  INST_ID: z.string().nullable(),
  MDEXM_END_HR_MNDY: z.string().nullable(),
  RMRK: z.string().nullable(),
  ESNS: z.string().nullable(),
  MDEXM_END_HR_STDY: z.string().nullable(),
  MDEXM_END_HR_WDDY: z.string().nullable(),
  SN: z.string().nullable(),
  MDEXM_END_HR_SNDY: z.string().nullable(),
  GEOM: z.string().nullable(),
  MDEXM_BGNG_HR_THDY: z.string().nullable(),
  INST_NM: z.string().nullable(),
  ZIP_2: z.string().nullable(),
  MDEXM_BGNG_HR_TSDY: z.string().nullable(),
  WKND_MDEXM_YN: z.string().nullable(),
  ZIP_1: z.string().nullable(),
  MDEXM_BGNG_HR_LHLDY: z.string().nullable(),
  MDEXM_END_HR_FRDY: z.string().nullable(),
  ADDR: z.string().nullable(),
  MDEXM_BGNG_HR_FRDY: z.string().nullable(),
  LOT: z.string().nullable(),
  YMAP_CRTS: z.string().nullable(),
  RPRS_TELNO: z.string().nullable(),
  MDEXM_END_HR_TSDY: z.string().nullable(),
  MDEXM_END_HR_LHLDY: z.string().nullable(),
  MDEXM_BGNG_HR_WDDY: z.string().nullable(),
  XMAP_CRTS: z.string().nullable(),
  LAT: z.string().nullable()
})

export const resSchema = z
  .object({
    greetings: z.string().openapi({
      example: '안녕하세요. *** 님',
      description: '인삿말'
    })
  })
  .openapi('HospitalResponse')
