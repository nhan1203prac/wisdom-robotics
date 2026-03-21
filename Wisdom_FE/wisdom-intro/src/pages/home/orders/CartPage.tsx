import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "./cartStore";
import LayoutHeader from "../../layoutHeader";
import { useState } from "react";

const CartPage = () => {
  const navigate = useNavigate();

  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // ✅ toggle chọn 1 item
  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // ✅ chọn tất cả
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map((i) => i.serviceId));
    } else {
      setSelectedItems([]);
    }
  };

  // ✅ xóa item + bỏ khỏi selected
  const handleRemove = (id: number) => {
    removeItem(id);
    setSelectedItems((prev) => prev.filter((i) => i !== id));
  };

  // ✅ chỉ lấy item được chọn
  const selectedCart = items.filter((item) =>
    selectedItems.includes(item.serviceId),
  );

  // ✅ tính tiền
  const totalPrice = selectedCart.reduce(
    (sum, item) => sum + item.quantity * (item.basePrice ?? 0),
    0,
  );

  const totalItems = selectedCart.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ checkout
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm");
      return;
    }

    navigate("/checkout", {
      state: { selectedItems },
    });
  };

  return (
    <>
      <LayoutHeader />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span>Quay lại cửa hàng</span>
              </button>

              <div className="h-6 w-px bg-gray-300 mx-4" />

              <h1 className="text-3xl font-bold flex items-center gap-3">
                <ShoppingBag className="text-blue-600" size={32} />
                Giỏ hàng
              </h1>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 flex items-center gap-2 text-sm"
              >
                <Trash2 size={18} />
                Xóa tất cả
              </button>
            )}
          </div>

          {/* EMPTY */}
          {items.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center">
              <ShoppingBag size={48} className="mx-auto text-gray-400 mb-6" />
              <h2 className="text-2xl font-semibold mb-3">Giỏ hàng trống</h2>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl"
              >
                Mua ngay
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* LIST */}
              <div className="lg:col-span-8">
                {/* ✅ CHỌN TẤT CẢ */}
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === items.length && items.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <span>Chọn tất cả</span>
                </div>

                <div className="space-y-6">
                  {items.map((item) => {
                    const price = item.basePrice ?? 0;

                    return (
                      <div
                        key={item.serviceId}
                        className="bg-white rounded-2xl p-6 flex gap-4"
                      >
                        {/* CHECKBOX */}
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.serviceId)}
                          onChange={() => toggleSelect(item.serviceId)}
                          className="w-5 h-5 mt-2 accent-blue-600"
                        />

                        {/* IMAGE */}
                        <div className="w-28 h-28 bg-gray-100 rounded-xl overflow-hidden">
                          <img
                            src={`http://localhost:8080/images/${item.thumbnail || "default.jpg"}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* INFO */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {item.serviceName}
                              </h3>
                              <p className="text-gray-500 text-sm">
                                ID: {item.serviceId}
                              </p>
                            </div>

                            <button
                              onClick={() => handleRemove(item.serviceId)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>

                          {/* QUANTITY */}
                          <div className="mt-6 flex justify-between items-center">
                            <div className="flex border rounded-xl overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.serviceId,
                                    Math.max(1, item.quantity - 1),
                                  )
                                }
                                className="px-4"
                              >
                                <Minus size={18} />
                              </button>

                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQuantity(
                                    item.serviceId,
                                    Math.max(1, Number(e.target.value) || 1),
                                  )
                                }
                                className="w-16 text-center outline-none border-x"
                              />

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.serviceId,
                                    item.quantity + 1,
                                  )
                                }
                                className="px-4"
                              >
                                <Plus size={18} />
                              </button>
                            </div>

                            {/* PRICE */}
                            <div className="text-right">
                              <p className="text-xl font-bold text-blue-600">
                                {(price * item.quantity).toLocaleString(
                                  "vi-VN",
                                )}{" "}
                                ₫
                              </p>
                              <p className="text-sm text-gray-500">
                                {price.toLocaleString("vi-VN")} ₫
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SIDEBAR */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl p-8 sticky top-8">
                  <h3 className="text-xl font-semibold mb-6">Thanh toán</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Số lượng</span>
                      <span>{totalItems} món</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>{totalPrice.toLocaleString("vi-VN")} ₫</span>
                    </div>

                    <div className="border-t my-4" />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng</span>
                      <span className="text-blue-600">
                        {totalPrice.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={selectedItems.length === 0}
                    onClick={handleCheckout}
                    className={`w-full mt-6 py-4 rounded-2xl text-white font-semibold
                      ${
                        selectedItems.length === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
