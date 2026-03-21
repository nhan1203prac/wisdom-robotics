// src/pages/home/orders/OrdersPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LayoutHeader from "../../layoutHeader";
interface OrderItem {
  serviceName: string;
  quantity: number;
  price: number;
  thumbnail?: string;
}

interface Order {
  orderId: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const allOrders: Order[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("order_")) {
        try {
          const orderData = JSON.parse(localStorage.getItem(key)!);
          allOrders.push(orderData);
        } catch (error) {
          console.error("Lỗi parse order:", error);
        }
      }
    }

    // Sắp xếp đơn mới nhất lên trên
    allOrders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setOrders(allOrders);
  }, []);

  const getStatusColor = (status: string) => {
    if (status.includes("thành công") || status.includes("Đã giao"))
      return "bg-green-100 text-green-700";
    if (status.includes("Đang")) return "bg-blue-100 text-blue-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <>
      {" "}
      <LayoutHeader />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Đơn mua của tôi
            </h1>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Bạn chưa có đơn mua nào
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  onClick={() => navigate(`/invoice/${order.orderId}`)}
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-6"
                >
                  {/* Hình ảnh sản phẩm */}
                  <div className="flex -space-x-3 flex-shrink-0">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow"
                      >
                        <img
                          src={
                            item.thumbnail
                              ? `http://localhost:8080/images/${item.thumbnail}`
                              : "https://via.placeholder.com/150?text=No+Image"
                          }
                          alt={item.serviceName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Thông tin đơn hàng */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-blue-600 font-bold">
                          #{order.orderId}
                        </span>
                      </div>
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status || "Chờ xác nhận"}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-sm">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="line-clamp-1 pr-4">
                            {item.serviceName}
                          </span>
                          <span className="text-gray-500 whitespace-nowrap">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tổng tiền */}
                  <div className="text-right min-w-[160px]">
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {order.totalAmount.toLocaleString("vi-VN")} ₫
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
