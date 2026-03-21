import React from "react";

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Employee Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Chào mừng nhân viên đến với hệ thống quản lý
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Product Management */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">

          <h2 className="text-xl font-semibold mb-4">
            Quản lý sản phẩm
          </h2>

          <ul className="text-gray-600 space-y-2 mb-4">
            <li>• Xem danh sách sản phẩm</li>
            <li>• Thêm / chỉnh sửa sản phẩm</li>
            <li>• Cập nhật tồn kho</li>
          </ul>

          <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Vào quản lý sản phẩm
          </button>

        </div>

        {/* Blog Management */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">

          <h2 className="text-xl font-semibold mb-4">
            Quản lý blog
          </h2>

          <ul className="text-gray-600 space-y-2 mb-4">
            <li>• Xem danh sách bài viết</li>
            <li>• Tạo bài viết mới</li>
            <li>• Chỉnh sửa bài viết</li>
          </ul>

          <button className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
            Vào quản lý blog
          </button>

        </div>

        {/* Customer View */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">

          <h2 className="text-xl font-semibold mb-4">
            Xem người dùng
          </h2>

          <ul className="text-gray-600 space-y-2 mb-4">
            <li>• Xem danh sách người dùng</li>
            <li>• Xem thông tin khách hàng</li>
            <li>• Theo dõi hoạt động</li>
          </ul>

          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Xem người dùng
          </button>

        </div>

      </div>

    </div>
  );
}