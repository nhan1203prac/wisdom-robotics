import { useState, useEffect } from "react";
import axios from "axios";
import { Order } from "../../../types/order.type"; // Đảm bảo đường dẫn này đúng với file type của bạn

export const useOrders = (userId: string | number) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Order[]>(
        `http://localhost:8080/api/orders/user/${userId}`,
      );
      setOrders(res.data);
    } catch {
      setError("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  return { orders, loading, error, refetch: fetchOrders };
};
