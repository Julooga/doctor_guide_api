import { HospitalPoiType, HospitalRequest } from '@/routes/hospital'
import hospitalEntity from '@/services/hospital/hospitalEntity'

// HSPTL_LOT, HSPTL_LAT
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

      // if (isNumber(query.latitude) && isNumber(query.longitude)) {
      //   const centerPoint = getCenterPoint({
      //     latitude: query.latitude,
      //     longitude: query.longitude
      //   })
      //
      //   const distance = calculateDistance(
      //     {
      //       latitude: query.latitude,
      //       longitude: query.longitude
      //     },
      //     centerPoint
      //   )
      //   const searchRadiusKm = getSearchRadiusKm(query.radius)
      //
      //   // TODO: 하버사인 공식을 사용하여 데이터 필터링
      //   // const nearbyLocations = dummyLocations.filter(location => {
      //   //   const locationPoint: Coordinates = { latitude: location.latitude, longitude: location.longitude };
      //   //   const distance = calculateDistance(centerPoint, locationPoint);
      //   //   return distance <= searchRadiusKm;
      //   // });
      //
      //   conditions.push()
      // }

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
    list: data.data as unknown as HospitalPoiType[],
    cursor: data.cursor
  }
}

export default getHospitalPoiData
