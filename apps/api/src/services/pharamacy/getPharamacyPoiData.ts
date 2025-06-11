import { PharmacyPoiType, PharmacyRequest } from '@/routes/pharamacy'
import pharmacyEntity from '@/services/pharamacy/pharmacyEntity'

const getPharamacyPoiData = async (query: PharmacyRequest) => {
  const data = await pharmacyEntity.scan
    .where(({ ADDR, INST_NM }, { contains }) => {
      const conditions = []

      if (query.ADDR) {
        // eslint-disable-next-line no-restricted-syntax
        conditions.push(contains(ADDR, query.ADDR))
      }

      if (query.INST_NM) {
        // eslint-disable-next-line no-restricted-syntax
        conditions.push(contains(INST_NM, query.INST_NM))
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
    list: data.data as unknown as PharmacyPoiType[],
    cursor: data.cursor
  }
}

export default getPharamacyPoiData
