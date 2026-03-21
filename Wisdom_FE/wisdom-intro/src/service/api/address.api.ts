import axios from 'axios'
import type { Province, District } from '@/types/address.type'

const BASE_URL = 'https://provinces.open-api.vn/api'

export const getProvinces = () => {
  return axios.get<Province[]>(`${BASE_URL}/?depth=1`)
}

export const getDistricts = (provinceCode: number) => {
  return axios.get<Province>(`${BASE_URL}/p/${provinceCode}?depth=2`)
}

export const getWards = (districtCode: number) => {
  return axios.get<District>(`${BASE_URL}/d/${districtCode}?depth=2`)
}