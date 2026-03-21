import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <div className="w-64 bg-blue-900 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10">Wisdom</h1>

        <nav className="space-y-4">
          <button
            onClick={() => navigate("/admin")}
            className="block w-full text-left hover:bg-blue-700 p-2 rounded"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/blog")}
            className="block w-full text-left hover:bg-blue-700 p-2 rounded"
          >
            Blog
          </button>

          <button
            onClick={() => navigate("/admin/products")}
            className="block w-full text-left hover:bg-blue-700 p-2 rounded"
          >
            Quản lý sản phẩm
          </button>

          <button
            onClick={() => navigate("/admin/services")}
            className="block w-full text-left hover:bg-blue-700 p-2 rounded"
          >
            Services
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="block w-full text-left hover:bg-blue-700 p-2 rounded"
          >
            Users
          </button>

          <button
            onClick={() => navigate("/admin/create-employee")}
            className="block w-full text-left hover:bg-blue-700 p-2 rounded"
          >
            Employees
          </button>

          <button className="block w-full text-left hover:bg-blue-700 p-2 rounded">
            Settings
          </button>
        </nav>

        {/* USER INFO */}
        <div className="mt-auto">
          <div className="bg-blue-800 p-3 rounded">
            <p className="text-sm">Minh Kera</p>
            <p className="text-xs text-gray-300">Admin</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 bg-gray-100">{children}</div>
    </div>
  );
}
