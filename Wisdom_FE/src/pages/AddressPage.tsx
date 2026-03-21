import Address from '../components/Users/Address'

export default function AddressPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Thông tin địa chỉ
        </h1>
        <Address />
      </div>
    </div>
  )
}