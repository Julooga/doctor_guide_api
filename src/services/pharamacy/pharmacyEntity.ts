import { Entity } from 'electrodb'
import { docClient } from '@/services/client'

const pharmacyEntity = new Entity(
  {
    model: {
      entity: 'pharmacy',
      version: '1',
      service: 'pharmacyService'
    },
    attributes: {
      INST_ID: { type: 'string', required: true },
      MDEXM_END_HR_THDY: { type: 'string' },
      INST_EXPLN_DTL: { type: 'string' },
      MDEXM_BGNG_HR_STDY: { type: 'string' },
      MDEXM_BGNG_HR_MNDY: { type: 'string' },
      MDEXM_BGNG_HR_SNDY: { type: 'string' },
      MDEXM_END_HR_MNDY: { type: 'string' },
      RMRK: { type: 'string' },
      ESNS: { type: 'string' },
      MDEXM_END_HR_STDY: { type: 'string' },
      MDEXM_END_HR_WDDY: { type: 'string' },
      SN: { type: 'number' },
      MDEXM_END_HR_SNDY: { type: 'string' },
      GEOM: { type: 'string' },
      MDEXM_BGNG_HR_THDY: { type: 'string' },
      INST_NM: { type: 'string' },
      ZIP_2: { type: 'string' },
      MDEXM_BGNG_HR_TSDY: { type: 'string' },
      WKND_MDEXM_YN: { type: 'string' },
      ZIP_1: { type: 'string' },
      MDEXM_BGNG_HR_LHLDY: { type: 'string' },
      MDEXM_END_HR_FRDY: { type: 'string' },
      ADDR: { type: 'string' },
      MDEXM_BGNG_HR_FRDY: { type: 'string' },
      LOT: { type: 'number' },
      YMAP_CRTS: { type: 'number' },
      RPRS_TELNO: { type: 'string' },
      MDEXM_END_HR_TSDY: { type: 'string' },
      MDEXM_END_HR_LHLDY: { type: 'string' },
      MDEXM_BGNG_HR_WDDY: { type: 'string' },
      XMAP_CRTS: { type: 'number' },
      LAT: { type: 'number' }
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
    table: 'Pharamacy-safetydata',
    client: docClient
  }
)

export default pharmacyEntity
