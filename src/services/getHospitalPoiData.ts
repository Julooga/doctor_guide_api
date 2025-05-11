import hospitalEntity from '@/services/hospitalEntity'
import { HospitalRequestType } from '@/schemas/hospital/schema'
import { HospitalPoiSchema } from 'sdk/api'

const getHospitalPoiData = async (query: HospitalRequestType) => {
  const data = await hospitalEntity.scan
    .where(({ ADDR, FIAI_MDLCR_INST_CD_NM }, { contains }) => {
      const conditions = []

      if (query.ADDR) {
        // eslint-disable-next-line no-restricted-syntax
        conditions.push(contains(ADDR, query.ADDR))
      }

      if (query.FIAI_MDLCR_INST_CD_NM) {
        // eslint-disable-next-line no-restricted-syntax
        conditions.push(
          contains(FIAI_MDLCR_INST_CD_NM, query.FIAI_MDLCR_INST_CD_NM)
        )
      }

      if (conditions.length > 0) {
        return conditions.join(' AND ')
      }

      return ''
    })
    .go({
      ignoreOwnership: true,
      limit: query.limit,
      cursor: query.cursor
    })

  return {
    list: data.data as unknown as HospitalPoiSchema[],
    cursor: data.cursor
  }
}

export default getHospitalPoiData
