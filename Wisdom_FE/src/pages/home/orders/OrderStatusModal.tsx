import React from "react";

const OrderStatusModal = ({
  orderId,
  isOpen,
  onClose,
}: {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const steps = [
    { label: "Đơn hàng đã đặt", desc: "30/03/2026", done: true },
    { label: "Đang xử lý", desc: "Đang chuẩn bị hàng", done: true },
    { label: "Đang giao hàng", desc: "Dự kiến giao 02/04/2026", done: false },
    { label: "Đã giao thành công", desc: "", done: false },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-8">
              Theo dõi đơn #{orderId}
            </h2>

            <div className="relative pl-8 space-y-10">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${step.done ? "text-green-600" : ""}`}
                    >
                      {step.label}
                    </p>
                    <p className="text-sm text-gray-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-10 w-full py-4 border-2 rounded-2xl text-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderStatusModal;
