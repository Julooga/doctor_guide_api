import { z } from '@hono/zod-openapi'

export const reqSchema = z
  .object({
    userName: z.string().optional().openapi({
      example: '홍길동',
      description: '사용자의 이름'
    })
  })
  .openapi('HospitalRequest')

export const hospitalPoiSchema = z.object({
  INST_EXPLN_DTL: z.string().nullable(),
  FIAI_MDLCR_INST_CD: z.string().nullable(),
  EMRO_TLHN: z.string().nullable(),
  MDEXM_HR_FRDY_C: z.string().nullable(),
  MDEXM_HR_WDDY_C: z.string().nullable(),
  HSPTL_CLSF_NM: z.string().nullable(),
  RPRS_TLHN_1: z.string().nullable(),
  INST_ID: z.string().nullable(),
  RMRK: z.string().nullable(),
  HSPTL_CLSF: z.string().nullable(),
  MDEXM_HR_STDY_C: z.string().nullable(),
  YCRD: z.string().nullable(),
  MDEXM_HR_MNDY_S: z.string().nullable(),
  MDEXM_HR_TSDY_C: z.string().nullable(),
  MDEXM_HR_LHLDY_C: z.string().nullable(),
  FIAI_MDLCR_INST_CD_NM: z.string().nullable(),
  INST_NM: z.string().nullable(),
  ZIP_2: z.string().nullable(),
  GID: z.string().nullable(),
  MDEXM_HR_THDY_S: z.string().nullable(),
  MDEXM_HR_STDY_S: z.string().nullable(),
  ZIP_1: z.string().nullable(),
  MDEXM_HR_MNDY_C: z.string().nullable(),
  HSPTL_LOT: z.string().nullable(),
  MDEXM_HR_TSDY_S: z.string().nullable(),
  ADDR: z.string().nullable(),
  MDEXM_HR_SNDY_S: z.string().nullable(),
  MDEXM_HR_LHLDY_S: z.string().nullable(),
  WKND_OPER_YN: z.string().nullable(),
  MDEXM_HR_THDY_C: z.string().nullable(),
  XCRD: z.string().nullable(),
  MDEXM_HR_FRDY_S: z.string().nullable(),
  ESNS_RGHMP: z.string().nullable(),
  MDEXM_HR_WDDY_S: z.string().nullable(),
  HSPTL_LAT: z.string().nullable(),
  EMRO_OPER_YN_: z.string().nullable(),
  MDEXM_HR_SNDY_C: z.string().nullable()
})

export const resSchema = z
  .object({
    greetings: z.string().openapi({
      example: '안녕하세요. *** 님',
      description: '인삿말'
    })
  })
  .openapi('HospitalResponse')
