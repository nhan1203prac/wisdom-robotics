// src/pages/home/orders/PaymentPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, QrCode } from "lucide-react";

interface OrderItem {
  serviceName: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: "COD" | "ONLINE";
  totalAmount: number;
  createdAt: string;
  status: string;
  items: OrderItem[];
}

const PaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const loadOrder = useCallback(() => {
    if (!orderId) {
      navigate("/cart");
      return;
    }

    const savedOrder = localStorage.getItem(`order_${orderId}`);
    if (savedOrder) {
      try {
        const parsedOrder: Order = JSON.parse(savedOrder);
        setOrder(parsedOrder);
      } catch (error) {
        console.error("Parse order error:", error);
        alert("Dữ liệu đơn hàng bị lỗi!");
        navigate("/cart");
      }
    } else {
      alert("Không tìm thấy đơn hàng!");
      navigate("/cart");
    }
  }, [orderId, navigate]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleConfirmPayment = async () => {
    if (!order || !orderId) return;
    setIsConfirming(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const updatedOrder = { ...order, status: "Đã thanh toán" };
    localStorage.setItem(`order_${orderId}`, JSON.stringify(updatedOrder));

    navigate(`/invoice/${orderId}`);
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
        Đang tải thông tin thanh toán...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} /> Quay lại
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <h1 className="text-3xl font-bold">Thanh toán đơn hàng</h1>
            <p className="mt-2 opacity-90">#{order.orderId}</p>
          </div>

          <div className="p-10">
            <div className="text-center mb-8">
              <p className="text-gray-500">Số tiền cần thanh toán</p>
              <p className="text-5xl font-bold text-blue-600 mt-2">
                {order.totalAmount.toLocaleString("vi-VN")} ₫
              </p>
            </div>

            {/* Thông tin chuyển khoản + QR */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Thông tin bên trái */}
              <div className="bg-gray-50 rounded-2xl p-8 space-y-6">
                <div>
                  <p className="text-sm text-gray-500">Khách hàng</p>
                  <p className="font-semibold text-lg">{order.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngân hàng</p>
                  <p className="font-semibold">Vietcombank</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số tài khoản</p>
                  <p className="font-mono text-2xl font-semibold">1234567890</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nội dung chuyển khoản</p>
                  <p className="font-mono bg-yellow-100 p-4 rounded-xl text-lg font-semibold text-center break-all">
                    THANHTOAN {order.orderId}
                  </p>
                </div>
              </div>

              {/* Phần QR Code bên phải */}
              <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-2xl p-8">
                <div className="flex items-center gap-2 mb-4">
                  <QrCode className="text-blue-600" size={28} />
                  <p className="font-semibold text-lg">
                    Quét QR để thanh toán nhanh
                  </p>
                </div>

                {/* QR Code */}
                <div className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-2xl shadow-sm">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=THANHTOAN%20ORD208780%26amount%3D1200000"
                    alt="QR Thanh toán"
                    className="w-60 h-60"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-6 text-center">
                  Sử dụng ứng dụng ngân hàng
                  <br />
                  (Vietcombank, Momo, ZaloPay, VNPay, BIDV, Techcombank...)
                </p>
              </div>
            </div>

            {/* Nút xác nhận */}
            <button
              onClick={handleConfirmPayment}
              disabled={isConfirming}
              className="mt-12 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-5 rounded-2xl text-xl flex items-center justify-center gap-3 transition-all"
            >
              <CheckCircle size={28} />
              {isConfirming
                ? "Đang xác nhận..."
                : "Tôi đã chuyển khoản thành công"}
            </button>

            <p className="text-center text-xs text-gray-500 mt-6">
              Vui lòng chuyển khoản đúng số tiền và nội dung trong vòng 30 phút
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
