// src/pages/service/ServiceDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Eye } from "lucide-react";
import { useCartStore } from "../home/orders/cartStore"; // chỉnh path nếu cần

interface Service {
  serviceId: number;
  serviceName: string;
  description: string;
  basePrice: number;
  thumbnail?: string;
  ratingAvg: number;
  ratingCount: number;
  viewCount: number;
  images?: string[]; // nếu có nhiều ảnh
}

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // TODO: Sau này thay bằng API call thật
    // fetch(`/api/services/${id}`)

    const mockService: Service = {
      serviceId: Number(id),
      serviceName: "Dịch vụ Test Chi Tiết",
      description:
        "Đây là mô tả chi tiết của dịch vụ. Chất lượng cao, uy tín, được nhiều khách hàng tin dùng. Chúng tôi cam kết mang đến trải nghiệm tốt nhất cho khách hàng.",
      basePrice: 1250000,
      thumbnail: "https://picsum.photos/id/1015/800/600",
      ratingAvg: 4.8,
      ratingCount: 142,
      viewCount: 1250,
      images: [
        "https://picsum.photos/id/1015/800/600",
        "https://picsum.photos/id/237/800/600",
        "https://picsum.photos/id/180/800/600",
      ],
    };

    setTimeout(() => {
      setService(mockService);
      setLoading(false);
    }, 800);
  }, [id]);

  const handleAddToCart = () => {
    if (!service) return;
    addItem(service.serviceId, quantity);
    alert(`Đã thêm ${quantity} "${service.serviceName}" vào giỏ hàng!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Không tìm thấy dịch vụ
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Hình ảnh */}
          <div>
            <img
              src={service.thumbnail}
              alt={service.serviceName}
              className="w-full rounded-2xl shadow-lg object-cover"
            />
            {/* Thumbnail nhỏ nếu có nhiều ảnh */}
            {service.images && service.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {service.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`thumb-${idx}`}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow cursor-pointer hover:border-blue-500"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thông tin chi tiết */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">
              {service.serviceName}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    fill={
                      i < Math.floor(service.ratingAvg)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>
              <span className="text-xl font-semibold">{service.ratingAvg}</span>
              <span className="text-gray-500">
                ({service.ratingCount} đánh giá)
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <Eye size={18} /> {service.viewCount} lượt xem
              </span>
            </div>

            {/* Giá */}
            <div className="text-4xl font-bold text-blue-600">
              {service.basePrice.toLocaleString("vi-VN")} ₫
            </div>

            {/* Mô tả */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Mô tả dịch vụ</h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Số lượng */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-6 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <ShoppingCart size={22} />
                Thêm vào giỏ hàng
              </button>

              <button className="flex-1 border-2 border-blue-600 text-blue-600 font-semibold py-4 rounded-2xl hover:bg-blue-50 transition-all">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
