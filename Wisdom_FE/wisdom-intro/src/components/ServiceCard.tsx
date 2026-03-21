import { Service } from "../types/service.type";
import { Link } from "react-router-dom";

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg p-4 transition">
      <img
        src={`http://localhost:8080/images/${service.thumbnail}`}
        alt={service.serviceName}
        className="rounded mb-3 w-full h-40 object-cover"
      />

      <h3 className="font-semibold text-lg">{service.serviceName}</h3>

      <p className="text-gray-500 line-clamp-2">{service.description}</p>

      <div className="flex justify-between items-center mt-2 text-sm">
        <span className="text-yellow-500">
          ⭐ {service.ratingAvg} ({service.ratingCount})
        </span>

        <span className="text-gray-500">👁 {service.viewCount}</span>
      </div>

      <p className="text-blue-600 font-bold mt-2">
        {service.basePrice.toLocaleString()}đ
      </p>

      <Link to={`/service/${service.serviceId}`}>
        <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Xem chi tiết
        </button>
      </Link>
    </div>
  );
}
