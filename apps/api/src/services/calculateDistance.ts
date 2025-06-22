import { isNumber } from 'lodash-es'

type Coordinates = {
  latitude: number
  longitude: number
}

/**
 * 도(degree)를 라디안(radian)으로 변환합니다.
 */
function toRadians(degree: number): number {
  return degree * (Math.PI / 180)
}

/**
 * 두 지점 간의 거리를 킬로미터(km) 단위로 계산합니다 (하버사인 공식).
 * @param coord1 첫 번째 지점의 위도, 경도
 * @param coord2 두 번째 지점의 위도, 경도
 * @returns 두 지점 간의 거리 (킬로미터)
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371 // 지구의 반지름 (킬로미터)

  const lat1Rad = toRadians(coord1.latitude)
  const lon1Rad = toRadians(coord1.longitude)
  const lat2Rad = toRadians(coord2.latitude)
  const lon2Rad = toRadians(coord2.longitude)

  const deltaLat = lat2Rad - lat1Rad
  const deltaLon = lon2Rad - lon1Rad

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // 킬로미터 단위 거리
}

// 중점을 구하는 함수
export const getCenterPoint = ({
  latitude,
  longitude
}: {
  latitude: number
  longitude: number
}) => {
  const centerLat = parseFloat(`${latitude}`)
  const centerLon = parseFloat(`${longitude}`)

  return { latitude: centerLat, longitude: centerLon }
}

// 검색 반경을 구하는 함수
export const getSearchRadiusKm = (radius?: number) => {
  if (!isNumber(radius)) {
    return parseFloat('200') / 1000
  }

  return parseFloat(`${radius}`) / 1000
}
