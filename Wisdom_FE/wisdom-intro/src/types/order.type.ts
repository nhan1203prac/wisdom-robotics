// src/features/order/types.ts

// ================= ENUM & CONSTANTS =================
export type OrderStatus =
  | "CART"       // statusId: 1
  | "PENDING"    // statusId: 2 (Chờ xác nhận)
  | "CONFIRMED"  // statusId: 3 (Đã xác nhận)
  | "COMPLETED"  // statusId: 4 (Đã xuất hóa đơn)
  | "CANCELLED"; // statusId: 5

export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export type PaymentMethod = "COD" | "ONLINE"; // Thêm để xử lý logic thanh toán

// ================= CART =================
export interface CartItem {
  serviceId: number;
  quantity: number;
  serviceName: string;
  thumbnail: string;
  basePrice: number; 
}

// ================= ORDER =================
export interface Order {
  id: number;
  userId: number;
  
  // Thông tin bổ sung từ bảng Users trong DB của bạn
  user?: {
    username: string;
    email: string;
    phone: string;
  };

  statusId: number;
  statusName?: string; // Lấy từ bảng order_status

  bookingDate: string;
  createdAt: string;

  totalPrice: number;
  note?: string;
  
  // Thông tin giao hàng (rất quan trọng cho hóa đơn)
  address?: string; 
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  items: OrderItem[];
}

// ================= ORDER ITEM =================
export interface OrderItem {
  id?: number;
  orderId?: number; // Link ngược lại bảng orders
  serviceId: number;
  quantity: number;
  price: number; 

  // Thông tin hiển thị (thường lấy qua Join trong SQL)
  serviceName?: string;
  thumbnail?: string;
}

// ================= CHECKOUT PAYLOAD =================
export interface CheckoutPayload {
  userId: number;
  statusId: number; 
  bookingDate: string;
  note?: string;
  
  // Thêm các trường này để Backend lưu thông tin giao hàng
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;

  // Danh sách item gửi lên
  items: Array<{
    serviceId: number;
    quantity: number;
    // Price thường do Backend tự tính từ DB để tránh User sửa giá ở client
  }>;
}

// ================= API RESPONSE =================
// Định nghĩa chuẩn cho dữ liệu trả về từ Spring Boot
export interface ApiResponse<T> {
  message: string;
  data: T;
}