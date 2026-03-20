import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, CheckCircle } from "lucide-react";
import { useCartStore } from "./cartStore";
import LayoutHeader from "../../layoutHeader";

// Định nghĩa kiểu dữ liệu cho địa chỉ
interface LocationItem {
  code: string | number;
  name: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();

  // State danh sách từ API
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [wards, setWards] = useState<LocationItem[]>([]);

  // State lựa chọn
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [houseNumber, setHouseNumber] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "COD" as "COD" | "ONLINE",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string }>({});

  // 1. Load Tỉnh/Thành
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error("Lỗi load tỉnh:", err));
  }, []);

  // 2. Load Quận/Huyện
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.districts || []));
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  // 3. Load Phường/Xã
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
        .then((res) => res.json())
        .then((data) => setWards(data.wards || []));
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  // 4. Tự động cập nhật địa chỉ đầy đủ vào formData
  useEffect(() => {
    const p =
      provinces.find((i) => String(i.code) === selectedProvince)?.name || "";
    const d =
      districts.find((i) => String(i.code) === selectedDistrict)?.name || "";
    const w = wards.find((i) => String(i.code) === selectedWard)?.name || "";

    const fullAddress = [houseNumber, w, d, p].filter(Boolean).join(", ");
    setFormData((prev) => ({ ...prev, address: fullAddress }));
  }, [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    houseNumber,
    provinces,
    districts,
    wards,
  ]);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * (item.basePrice ?? 0),
    0,
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "phone") {
      if (!/^(0|\+84)[0-9]{9}$/.test(value)) {
        setErrors((prev) => ({ ...prev, phone: "Số điện thoại không hợp lệ" }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
  };

  // ... các phần khác giữ nguyên

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.phone ||
      !selectedWard ||
      !houseNumber
    ) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ giao hàng!");
      return;
    }

    setIsLoading(true);
    try {
      const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);

      const orderData = {
        orderId,
        ...formData, // Trong này đã có paymentMethod: "COD" hoặc "ONLINE"
        totalAmount: totalPrice,
        createdAt: new Date().toISOString(),
        // Logic trạng thái chuẩn
        status:
          formData.paymentMethod === "COD" ? "Chờ xác nhận" : "Đã thanh toán",
        items: items.map((item) => ({
          serviceName: item.serviceName,
          quantity: item.quantity,
          price: item.basePrice ?? 0,
          thumbnail: item.thumbnail || "default.jpg",
        })),
      };

      // Lưu vào localStorage
      localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));

      // Xóa giỏ hàng
      clearCart();

      // Điều hướng đúng trang
      if (formData.paymentMethod === "ONLINE") {
        navigate(`/payment/${orderId}`);
      } else {
        navigate(`/invoice/${orderId}`);
      }
    } catch {
      alert("Có lỗi xảy ra khi tạo đơn hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  // UI PHẦN CHỌN PHƯƠNG THỨC (Đảm bảo sự kiện onClick hoạt động)
  // Hãy kiểm tra xem trong JSX của bạn, phần onClick đã viết như thế này chưa:
  /*
    <div 
      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "COD" }))}
      className={`border-2 p-5 cursor-pointer ${formData.paymentMethod === "COD" ? "border-blue-600" : ""}`}
    >
      ... Nội dung COD
    </div>
  */

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <LayoutHeader />
        <div className="text-center bg-white p-10 rounded-3xl shadow-sm mt-20">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Giỏ hàng của bạn đang trống
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all"
          >
            Quay về cửa hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <LayoutHeader />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8 mt-16">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="font-medium">Quay lại giỏ hàng</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                  <Truck className="text-blue-600" /> Thông tin giao hàng
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border rounded-2xl outline-none transition-all ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        placeholder="Nhập số điện thoại"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ nhận hàng *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select
                        value={selectedProvince}
                        onChange={(e) => {
                          setSelectedProvince(e.target.value);
                          setSelectedDistrict("");
                          setSelectedWard("");
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl outline-none"
                      >
                        <option value="">Tỉnh / Thành</option>
                        {provinces.map((p) => (
                          <option key={p.code} value={p.code}>
                            {p.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedDistrict}
                        onChange={(e) => {
                          setSelectedDistrict(e.target.value);
                          setSelectedWard("");
                        }}
                        disabled={!selectedProvince}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl outline-none disabled:bg-gray-50"
                      >
                        <option value="">Quận / Huyện</option>
                        {districts.map((d) => (
                          <option key={d.code} value={d.code}>
                            {d.name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        disabled={!selectedDistrict}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl outline-none disabled:bg-gray-50"
                      >
                        <option value="">Phường / Xã</option>
                        {wards.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      value={houseNumber}
                      onChange={(e) => setHouseNumber(e.target.value)}
                      placeholder="Số nhà, tên đường..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Ghi chú thêm cho đơn hàng..."
                    />
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">
                      Phương thức thanh toán
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() =>
                          setFormData((p) => ({ ...p, paymentMethod: "COD" }))
                        }
                        className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${formData.paymentMethod === "COD" ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}
                      >
                        <div className="flex items-center gap-3">
                          <Truck className="text-green-600" size={28} />
                          <div>
                            <p className="font-semibold">Khi nhận hàng (COD)</p>
                            <p className="text-sm text-gray-500">Tiền mặt</p>
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            paymentMethod: "ONLINE",
                          }))
                        }
                        className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${formData.paymentMethod === "ONLINE" ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="text-blue-600" size={28} />
                          <div>
                            <p className="font-semibold">Thanh toán online</p>
                            <p className="text-sm text-gray-500">
                              Chuyển khoản / Ví
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-4 rounded-2xl text-lg transition-all flex items-center justify-center gap-3 shadow-lg"
                  >
                    <CheckCircle size={24} />
                    {isLoading
                      ? "Đang xử lý..."
                      : `Xác nhận đặt hàng - ${totalPrice.toLocaleString("vi-VN")} ₫`}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl shadow-sm p-8 sticky top-24">
                <h3 className="text-2xl font-semibold mb-6">
                  Tóm tắt đơn hàng
                </h3>
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.serviceId}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                          <img
                            src={`http://localhost:8080/images/${item.thumbnail || "default.jpg"}`}
                            alt={item.serviceName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-1">
                            {item.serviceName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {((item.basePrice ?? 0) * item.quantity).toLocaleString(
                          "vi-VN",
                        )}{" "}
                        ₫
                      </p>
                    </div>
                  ))}

                  <div className="h-px bg-gray-100 my-4" />
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Tổng tiền</span>
                    <span className="font-bold text-2xl text-blue-600">
                      {totalPrice.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-2xl mt-6">
                    <p className="text-xs text-blue-700 leading-relaxed">
                      • Đơn hàng sẽ được xác nhận trong vòng 30 phút
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
