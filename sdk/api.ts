/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HospitalResponse {
  success: boolean;
  data: {
    list: HospitalPoiSchema[];
    cursor: string | null;
  };
}

export interface HospitalPoiSchema {
  /** 기관설명상세 */
  INST_EXPLN_DTL: string | null;
  /**
   * 응급의료기관코드
   * @example "G006"
   */
  FIAI_MDLCR_INST_CD: string | null;
  /**
   * 응급실전화번호
   * @example "031-300-0119"
   */
  EMRO_TLHN: string | null;
  /**
   * 진료종료시간금요일
   * @example "1730"
   */
  MDEXM_HR_FRDY_C: string | null;
  /**
   * 진료종료시간수요일
   * @example "1730"
   */
  MDEXM_HR_WDDY_C: string | null;
  /**
   * 병원분류명
   * @example "종합병원"
   */
  HSPTL_CLSF_NM: string | null;
  /**
   * 대표전화번호
   * @example "031-300-0114"
   */
  RPRS_TLHN_1: string | null;
  /**
   * 기관아이디
   * @example "A2100029"
   */
  INST_ID: string | null;
  /**
   * 비고
   * @example "- 점심시간: 12시 30분 ~ 13시 30분"
   */
  RMRK: string | null;
  /**
   * 병원분류
   * @example "A"
   */
  HSPTL_CLSF: string | null;
  /**
   * 진료종료시간토요일
   * @example "1230"
   */
  MDEXM_HR_STDY_C: string | null;
  /**
   * Y지도좌표
   * @example 4477337.182
   */
  YCRD: number | null;
  /**
   * 진료시작시간월요일
   * @example "830"
   */
  MDEXM_HR_MNDY_S: string | null;
  /**
   * 진료종료시간화요일
   * @example "1730"
   */
  MDEXM_HR_TSDY_C: string | null;
  /** 진료종료시간공휴일 */
  MDEXM_HR_LHLDY_C: string | null;
  /**
   * 응급의료기관코드명
   * @example "지역응급의료센터"
   */
  FIAI_MDLCR_INST_CD_NM: string | null;
  /**
   * 기관명
   * @example "강남병원"
   */
  INST_NM: string | null;
  /**
   * 우편번호2
   * @example "64"
   */
  ZIP_2: string | null;
  /**
   * 기관고유번호
   * @example "139"
   */
  GID: string | null;
  /**
   * 진료시작시간목요일
   * @example "830"
   */
  MDEXM_HR_THDY_S: string | null;
  /**
   * 진료시작시간토요일
   * @example "830"
   */
  MDEXM_HR_STDY_S: string | null;
  /**
   * 우편번호1
   * @example "170"
   */
  ZIP_1: string | null;
  /**
   * 진료종료시간월요일
   * @example "1730"
   */
  MDEXM_HR_MNDY_C: string | null;
  /**
   * 병원경도
   * @example 127.1114072
   */
  HSPTL_LOT: number | null;
  /**
   * 진료시작시간화요일
   * @example "830"
   */
  MDEXM_HR_TSDY_S: string | null;
  /**
   * 주소
   * @example "경기도 용인시 기흥구 중부대로 411, 강남병원 (신갈동)"
   */
  ADDR: string | null;
  /** 진료시작시간일요일 */
  MDEXM_HR_SNDY_S: string | null;
  /** 진료시작시간공휴일 */
  MDEXM_HR_LHLDY_S: string | null;
  /**
   * 주말운영여부
   * @example "N"
   */
  WKND_OPER_YN: string | null;
  /**
   * 진료종료시간목요일
   * @example "1730"
   */
  MDEXM_HR_THDY_C: string | null;
  /**
   * X지도좌표
   * @example 14149977.12
   */
  XCRD: number | null;
  /**
   * 진료시작시간금요일
   * @example "830"
   */
  MDEXM_HR_FRDY_S: string | null;
  /** 간이약도 */
  ESNS_RGHMP: string | null;
  /**
   * 진료시작시간수요일
   * @example "830"
   */
  MDEXM_HR_WDDY_S: string | null;
  /**
   * 병원위도
   * @example 37.27377984
   */
  HSPTL_LAT: number | null;
  /**
   * 응급실운영여부
   * @example "1"
   */
  EMRO_OPER_YN_: string | null;
  /** 진료종료시간일요일 */
  MDEXM_HR_SNDY_C: string | null;
}

export interface HospitalRequest {
  /**
   * 페이지 당 레코드 개수
   * @example "10"
   */
  limit?: string;
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

export interface PharamacyResponse {
  success: boolean;
  data: {
    list: PharmacyPoiSchema[];
    cursor: string | null;
  };
}

export interface PharmacyPoiSchema {
  /**
   * 진료종료시간목요일
   * @example "2000"
   */
  MDEXM_END_HR_THDY: string | null;
  /** 기관설명상세 */
  INST_EXPLN_DTL: string | null;
  /**
   * 진료시작시간토요일
   * @example "1000"
   */
  MDEXM_BGNG_HR_STDY: string | null;
  /**
   * 진료시작시간월요일
   * @example "1000"
   */
  MDEXM_BGNG_HR_MNDY: string | null;
  /** 진료시작시간일요일 */
  MDEXM_BGNG_HR_SNDY: string | null;
  /**
   * 기관아이디
   * @example "C2800751"
   */
  INST_ID: string | null;
  /**
   * 진료종료시간월요일
   * @example "2000"
   */
  MDEXM_END_HR_MNDY: string | null;
  /** 비고 */
  RMRK: string | null;
  /**
   * 간이
   * @example "웅상지구대"
   */
  ESNS: string | null;
  /**
   * 진료종료시간토요일
   * @example "2000"
   */
  MDEXM_END_HR_STDY: string | null;
  /**
   * 진료종료시간수요일
   * @example "2000"
   */
  MDEXM_END_HR_WDDY: string | null;
  /**
   * 일련번호
   * @example 234
   */
  SN: number | null;
  /** 진료종료시간일요일 */
  MDEXM_END_HR_SNDY: string | null;
  /**
   * 지오메트리
   * @example "POINT(14379397.96265367 4220567.7607631003)"
   */
  GEOM: string | null;
  /**
   * 진료시작시간목요일
   * @example "1000"
   */
  MDEXM_BGNG_HR_THDY: string | null;
  /**
   * 약국이름
   * @example "명동약국"
   */
  INST_NM: string | null;
  /**
   * 우편번호2
   * @example "32"
   */
  ZIP_2: string | null;
  /**
   * 진료시작시간화요일
   * @example "1000"
   */
  MDEXM_BGNG_HR_TSDY: string | null;
  /**
   * 주말진료여부
   * @example "Y"
   */
  WKND_MDEXM_YN: string | null;
  /**
   * 우편번호1
   * @example "505"
   */
  ZIP_1: string | null;
  /**
   * 진료시작시간공휴일
   * @example "1000"
   */
  MDEXM_BGNG_HR_LHLDY: string | null;
  /**
   * 진료종료시간금요일
   * @example "2000"
   */
  MDEXM_END_HR_FRDY: string | null;
  /**
   * 주소
   * @example "경상남도 양산시 대운로 181, 1층 (명동)"
   */
  ADDR: string | null;
  /**
   * 진료시작시간금요일
   * @example "1000"
   */
  MDEXM_BGNG_HR_FRDY: string | null;
  /**
   * 경도
   * @example 129.1723296629
   */
  LOT: number | null;
  /**
   * Y지도좌표
   * @example 4220567.7607631
   */
  YMAP_CRTS: number | null;
  /**
   * 대표전화번호
   * @example "055-365-2584"
   */
  RPRS_TELNO: string | null;
  /**
   * 진료종료시간화요일
   * @example "2000"
   */
  MDEXM_END_HR_TSDY: string | null;
  /**
   * 진료종료시간공휴일
   * @example "2000"
   */
  MDEXM_END_HR_LHLDY: string | null;
  /**
   * 진료시작시간수요일
   * @example "1000"
   */
  MDEXM_BGNG_HR_WDDY: string | null;
  /**
   * X지도좌표
   * @example 14379397.962653672
   */
  XMAP_CRTS: number | null;
  /**
   * 위도
   * @example 35.4160672505
   */
  LAT: number | null;
}

export interface PharmacyRequest {
  /**
   * 페이지 당 레코드 개수
   * @example "10"
   */
  limit?: string;
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
  INST_NM: string | null;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Doctor Guide Api
 * @version 1.0.0
 *
 * Development documentation
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  hospital = {
    /**
     * @description 재난안전데이터 공유플랫폼이 제공하는 행정안전부 병의원 POI 목록을 반환하는 get 메소드
     *
     * @name GetHospital
     * @request GET:/hospital
     */
    getHospital: (
      query?: {
        "#/components/schemas/HospitalRequest"?: HospitalRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<HospitalResponse, any>({
        path: `/hospital`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  pharamacy = {
    /**
     * @description 재난안전데이터 공유플랫폼이 제공하는 행정안전부 약국 POI 목록을 반환하는 get 메소드
     *
     * @name GetPharamacy
     * @request GET:/pharamacy
     */
    getPharamacy: (
      query?: {
        "#/components/schemas/PharmacyRequest"?: PharmacyRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<PharamacyResponse, any>({
        path: `/pharamacy`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
