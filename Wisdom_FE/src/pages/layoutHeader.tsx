// src/components/layoutHeader.tsx (hoặc LayoutHeader.tsx)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  User,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import Cookies from "js-cookie";

interface User {
  username: string;
  avatar?: string;
}

const LayoutHeader: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Giả sử bạn lấy user từ context hoặc redux
  const user: User | null = {
    username: "abccc",
    avatar: "https://i.pravatar.cc/40",
  };

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Wisdom Shop
        </Link>

        {/* Menu chính */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
          >
            <Home size={20} />
            Home
          </Link>

          <Link
            to="/products"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Products
          </Link>

          <Link
            to="/blog"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Blog
          </Link>

          {/* User Dropdown */}
          <div className="relative">
            {user ? (
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <img
                  src={user.avatar || "https://i.pravatar.cc/40"}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                  alt="avatar"
                />
                <span className="font-semibold text-gray-800">
                  {user.username}
                </span>
              </div>
            ) : (
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Đăng nhập
              </Link>
            )}

            {/* Dropdown Menu */}
            {open && (
              <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-2xl border border-gray-100 py-2 z-50 overflow-hidden">
                <Link
                  to="/cart"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <ShoppingCart size={20} />
                  Giỏ hàng
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <Package size={20} />
                  Đơn mua
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <User size={20} />
                  Thông tin cá nhân
                </Link>

                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <Settings size={20} />
                  Cài đặt
                </Link>

                <div className="border-t my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LayoutHeader;
