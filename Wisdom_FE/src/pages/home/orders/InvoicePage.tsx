import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Printer, ArrowLeft, Truck, CheckCircle, Home } from "lucide-react";

interface OrderItem {
  serviceName: string;
  quantity: number;
  price: number;
  thumbnail?: string;
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

const InvoicePage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  const loadOrder = useCallback(() => {
    if (!orderId) {
      navigate("/orders");
      return;
    }

    const savedOrder = localStorage.getItem(`order_${orderId}`);
    if (savedOrder) {
      try {
        const parsed: Order = JSON.parse(savedOrder);
        setOrder(parsed);
      } catch (error) {
        console.error("Parse error:", error);
        alert("Dữ liệu hóa đơn bị lỗi!");
        navigate("/orders");
      }
    } else {
      alert("Không tìm thấy đơn hàng!");
      navigate("/orders");
    }
  }, [orderId, navigate]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handlePrint = () => window.print();

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Đang tải hóa đơn...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={22} />
            <span className="font-medium">Quay lại đơn mua</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 px-5 py-3 rounded-2xl font-medium transition-all"
            >
              <Home size={20} />
              Trang chủ
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-400 px-5 py-3 rounded-2xl font-medium transition-all"
            >
              <Printer size={20} />
              In hóa đơn
            </button>

            <button
              onClick={() => navigate(`/track/${order.orderId}`)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-blue-700 transition-all"
            >
              <Truck size={20} />
              Theo dõi trạng thái
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-8 flex justify-between">
            <div>
              <h1 className="text-4xl font-bold">HÓA ĐƠN</h1>
              <p className="mt-1 text-blue-100">Wisdom Intro Services</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">Mã đơn hàng</p>
              <p className="text-2xl font-mono font-bold">#{order.orderId}</p>
              <p className="text-sm mt-2 opacity-75">
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 border-b">
            <div>
              <p className="uppercase text-xs text-gray-500 mb-2">
                Thông tin khách hàng
              </p>
              <p className="font-semibold text-lg">{order.fullName}</p>
              <p className="text-gray-600">{order.phone}</p>
              <p className="text-gray-600">{order.address}</p>
              {order.note && (
                <p className="text-sm text-gray-500 mt-3 italic">
                  Ghi chú: "{order.note}"
                </p>
              )}
            </div>

            <div>
              <p className="uppercase text-xs text-gray-500 mb-2">
                Phương thức thanh toán
              </p>
              <div className="flex items-center gap-3">
                {order.paymentMethod === "COD" ? (
                  <>
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Truck className="text-orange-600" size={28} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-gray-800">
                        Thanh toán khi nhận hàng (COD)
                      </p>
                      <p className="text-orange-600 font-medium">
                        Vui lòng thanh toán khi nhận hàng
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="text-green-600" size={28} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-gray-800">
                        Đã thanh toán online
                      </p>
                      <p className="text-green-600 font-medium">
                        Hóa đơn đã được thanh toán thành công
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-10">
            <table className="w-full">
              <thead>
                <tr className="border-b text-gray-500 text-sm">
                  <th className="text-left py-4 font-medium w-20"></th>
                  <th className="text-left py-4 font-medium">
                    Dịch vụ / Sản phẩm
                  </th>
                  <th className="text-center py-4 font-medium">Số lượng</th>
                  <th className="text-right py-4 font-medium">Đơn giá</th>
                  <th className="text-right py-4 font-medium">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-6">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden border">
                        <img
                          src={
                            item.thumbnail
                              ? `http://localhost:8080/images/${item.thumbnail}`
                              : "https://via.placeholder.com/150"
                          }
                          alt={item.serviceName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-6 font-medium text-gray-800">
                      {item.serviceName}
                    </td>
                    <td className="py-6 text-center">{item.quantity}</td>
                    <td className="py-6 text-right text-gray-600">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="py-6 text-right font-bold text-gray-900">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-10">
              <div className="text-right">
                <p className="text-gray-500 font-medium">Tổng thanh toán</p>
                <p className="text-4xl font-bold text-blue-600 mt-1">
                  {order.totalAmount.toLocaleString("vi-VN")} ₫
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
