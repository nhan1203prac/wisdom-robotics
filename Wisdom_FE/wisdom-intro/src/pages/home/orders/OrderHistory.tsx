import React, { useState } from "react";
import {
  Ticket,
  ChevronRight,
  CheckCircle,
  Package,
  Calendar,
  Search,
  RefreshCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from "../User/userOrders";
import { Order } from "../../../types/order.type";

const OrderHistory = () => {
  const { orders, loading, error, refetch } = useOrders(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter logic nâng cao
  const filteredOrders = orders.filter((o) =>
    o.id.toString().includes(searchTerm),
  );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <p className="mb-4">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
        >
          <RefreshCcw size={16} /> Thử lại
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
              <Ticket className="text-white" size={28} />
            </div>
            Lịch sử giao dịch
          </h1>
          <p className="text-gray-500 mt-1 ml-14">
            Quản lý và theo dõi các hóa đơn của bạn
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm theo mã đơn..."
            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl w-full md:w-64 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {loading ? (
          // Skeleton Loader
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 w-full bg-gray-200 animate-pulse rounded-2xl"
            />
          ))
        ) : filteredOrders.length > 0 ? (
          <AnimatePresence>
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="group bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-xl hover:shadow-blue-500/5"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl ${order.statusId === 4 ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}
                  >
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-lg text-gray-800 tracking-tight">
                        #{order.id}
                      </span>
                      <StatusBadge statusId={order.statusId} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />{" "}
                        {new Date(order.bookingDate).toLocaleDateString(
                          "vi-VN",
                        )}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="font-semibold text-blue-600 text-base">
                        {order.totalPrice?.toLocaleString()} ₫
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-sm active:scale-95"
                >
                  Xem hóa đơn{" "}
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">Không tìm thấy đơn hàng nào.</p>
          </div>
        )}
      </div>

      {/* Detail Overlay/Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          >
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full relative">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">
                Chi tiết đơn hàng #{selectedOrder.id}
              </h3>
              <p className="text-gray-500 text-center mb-6">
                Thông tin chi tiết đã được hệ thống xác thực.
              </p>

              <div className="space-y-3 mb-8">
                <DetailItem
                  label="Tổng tiền"
                  value={`${selectedOrder.totalPrice?.toLocaleString()} ₫`}
                  highlight
                />
                <DetailItem
                  label="Trạng thái"
                  value={
                    selectedOrder.statusId === 4 ? "Hoàn thành" : "Đang xử lý"
                  }
                />
                <DetailItem
                  label="Thời gian"
                  value={new Date(selectedOrder.bookingDate).toLocaleString(
                    "vi-VN",
                  )}
                />
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg active:scale-95"
              >
                Đóng chi tiết
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Helper Components ---

const StatusBadge = ({ statusId }: { statusId: number }) => {
  const isDone = statusId === 4;
  return (
    <span
      className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-lg uppercase ${
        isDone ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
      }`}
    >
      {isDone ? "Hoàn thành" : "Đang xử lý"}
    </span>
  );
};

const DetailItem = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
    <span className="text-gray-500">{label}</span>
    <span
      className={`font-bold ${highlight ? "text-blue-600 text-lg" : "text-gray-800"}`}
    >
      {value}
    </span>
  </div>
);

export default OrderHistory;
