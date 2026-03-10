import { useEffect, useState } from 'react'
import { getProvinces, getDistricts, getWards } from '@/service/api/address.api'
import type { Province, District, Ward } from '@/types/address.type'


export default function Address() {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  const [provinceCode, setProvinceCode] = useState<number>()
  const [districtCode, setDistrictCode] = useState<number>()

  // Load tỉnh / thành
  useEffect(() => {
    getProvinces().then(res => setProvinces(res.data))
  }, [])

  // Chọn tỉnh
  const handleProvinceChange = async (code: number) => {
    setProvinceCode(code)
    setDistrictCode(undefined)
    setDistricts([])
    setWards([])

    const res = await getDistricts(code)
    setDistricts(res.data.districts ?? [])
  }

  // Chọn quận
  const handleDistrictChange = async (code: number) => {
    setDistrictCode(code)
    setWards([])

    const res = await getWards(code)
    setWards(res.data.wards ?? [])
  }

  return (
    <div className="space-y-6 max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="province">
          Tỉnh / thành phố
        </label>
        <select
          id="province"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={provinceCode ?? ''}
          onChange={e => handleProvinceChange(Number(e.target.value))}
        >
          <option value="">-- Chọn tỉnh / thành phố --</option>
          {provinces.map(p => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="district">
          Quận / huyện
        </label>
        <select
          id="district"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:bg-gray-100"
          value={districtCode ?? ''}
          disabled={!provinceCode}
          onChange={e => handleDistrictChange(Number(e.target.value))}
        >
          <option value="">-- Chọn quận / huyện --</option>
          {districts.map(d => (
            <option key={d.code} value={d.code}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700" htmlFor="ward">
          Phường / xã
        </label>
        <select
          id="ward"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:bg-gray-100"
          disabled={!districtCode}
        >
          <option value="">-- Chọn phường / xã --</option>
          {wards.map(w => (
            <option key={w.code} value={w.code}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}