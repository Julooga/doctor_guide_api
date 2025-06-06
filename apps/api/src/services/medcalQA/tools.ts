import { Api } from '@julooga/sdk'
import { DynamicTool } from '@langchain/core/tools'

const api = new Api()

export const hospitalSearchTool = new DynamicTool({
  name: 'hospital_search',
  description: `위치 기반으로 병원을 검색합니다. 
  입력: {
    "params": 
      /**
       * 페이지 당 레코드 개수
       * @example "10"
       */
      limit?: number;
      /** 다음 페이지를 조회하는 커서 */
      cursor?: string;
      /**
       * 주소
     * @example "서울"
     */
    ADDR?: string;
    /**
     * 응급의료기관코드명
     * @example "응급"
     */
    FIAI_MDLCR_INST_CD_NM?: string;
  }
`,
  func: (input: string) => {
    const params: {
      limit?: number
      cursor?: string
      ADDR?: string
      FIAI_MDLCR_INST_CD_NM?: string
    } = JSON.parse(input)

    return api.hospital.getHospital(params)
  }
})

export const pharmacySearchTool = new DynamicTool({
  name: 'pharmacy_search',
  description: `위치 기반으로 약국을 검색합니다. 
  입력: {
    /**
     * 페이지 당 레코드 개수
     * @example "10"
     */
    limit?: number;
    /** 다음 페이지를 조회하는 커서 */
    cursor?: string;
    /**
     * 주소
     * @example "경기"
     */
    ADDR?: string;
    /**
     * 약국이름
     * @example "역곡"
     */
    INST_NM?: string;
  }
`,
  func: (input: string) => {
    const params: {
      /**
       * 페이지 당 레코드 개수
       * @example "10"
       */
      limit?: number
      /** 다음 페이지를 조회하는 커서 */
      cursor?: string
      /**
       * 주소
       * @example "경기"
       */
      ADDR?: string
      /**
       * 약국이름
       * @example "역곡"
       */
      INST_NM?: string
    } = JSON.parse(input)

    return api.pharamacy.getPharamacy(params)
  }
})
