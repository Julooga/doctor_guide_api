import { HospitalPoiDataType, HospitalRequest } from '@/routes/hospital'
import hospitalEntity from '@/services/hospital/hospitalEntity'

const getHospitalPoiData = async (query: HospitalRequest) => {
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
    list: data.data as unknown as HospitalPoiDataType[],
    cursor: data.cursor
  }
}

export default getHospitalPoiData
