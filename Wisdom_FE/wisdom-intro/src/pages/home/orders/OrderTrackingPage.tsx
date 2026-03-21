// src/pages/home/orders/OrderTrackingPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";

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
  totalAmount: number;
  createdAt: string;
  status: string;
  items: OrderItem[];
}

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);

  const loadOrder = useCallback(() => {
    if (!orderId) {
      navigate("/cart");
      return;
    }

    const savedOrder = localStorage.getItem(`order_${orderId}`);
    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch {
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

  // Các bước theo dõi chi tiết (có thể mở rộng sau)
  const trackingSteps = [
    {
      id: 1,
      title: "Đơn hàng đã đặt",
      desc: "Đơn hàng được tạo thành công",
      date: "30/03/2026",
      done: true,
      icon: Clock,
    },
    {
      id: 2,
      title: "Người bán xác nhận còn hàng",
      desc: "Wisdom Intro đã kiểm tra và xác nhận còn hàng",
      date: "30/03/2026",
      done: true,
      icon: CheckCircle,
    },
    {
      id: 3,
      title: "Đang đóng gói hàng",
      desc: "Đang chuẩn bị và đóng gói sản phẩm",
      date: "31/03/2026",
      done: true,
      icon: Package,
    },
    {
      id: 4,
      title: "Đã chuyển giao cho vận chuyển",
      desc: "Bàn giao cho GHTK / GHN",
      date: "31/03/2026",
      done: true,
      icon: Truck,
    },
    {
      id: 5,
      title: "Đang vận chuyển",
      desc: "Đơn hàng đang trên đường giao",
      date: "01/04/2026",
      done: false,
      icon: Truck,
    },
    {
      id: 6,
      title: "Đã giao thành công",
      desc: "Khách hàng đã nhận hàng",
      date: "Dự kiến 02/04/2026",
      done: false,
      icon: CheckCircle,
    },
  ];

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate(`/invoice/${orderId}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={22} /> Quay lại hóa đơn
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
            <h1 className="text-3xl font-bold">Theo dõi đơn hàng</h1>
            <p className="text-xl mt-2">#{order.orderId}</p>
          </div>

          <div className="p-10">
            {/* Thông tin đơn hàng */}
            <div className="mb-10 bg-gray-50 p-6 rounded-2xl">
              <p className="text-sm text-gray-500">Khách hàng</p>
              <p className="font-semibold text-lg">{order.fullName}</p>
              <p className="text-gray-600">{order.phone}</p>
            </div>

            {/* Timeline chi tiết */}
            <div className="relative pl-8 space-y-12">
              {trackingSteps.map((step, index) => {
                const Icon = step.icon;
                const isDone = step.done;

                return (
                  <div key={step.id} className="flex gap-6 relative">
                    {/* Đường kẻ dọc */}
                    {index !== trackingSteps.length - 1 && (
                      <div className="absolute left-5 top-10 h-full w-[2px] bg-gray-200" />
                    )}

                    {/* Icon tròn */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        isDone
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <Icon size={22} />
                    </div>

                    <div className="flex-1">
                      <p
                        className={`font-semibold text-lg ${isDone ? "text-green-600" : "text-gray-600"}`}
                      >
                        {step.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                      <p className="text-xs text-gray-400 mt-2">{step.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 px-10 py-6 text-center text-sm text-gray-500 border-t">
            Cảm ơn bạn đã sử dụng dịch vụ. Đơn hàng đang được xử lý nhanh chóng.
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
