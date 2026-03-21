import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const users = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "vana@gmail.com",
      role: "User",
      status: "Active",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "admin@gmail.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "user@gmail.com",
      role: "User",
      status: "Blocked",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-blue-900 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-10">Wisdom</h1>

        <nav className="space-y-4">
          <button className="block w-full text-left hover:bg-blue-700 p-2 rounded">
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

        <div className="mt-auto">
          <div className="bg-blue-800 p-3 rounded">
            <p className="text-sm">Minh Kera</p>
            <p className="text-xs text-gray-300">Admin</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">User Management</h2>

          <button
            onClick={() => navigate("/admin/create-employee")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add User
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-bold">8</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Active Users</p>
            <p className="text-2xl font-bold text-green-500">6</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Blocked Users</p>
            <p className="text-2xl font-bold text-red-500">2</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 text-sm">Admins</p>
            <p className="text-2xl font-bold">1</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex gap-4 mb-6">
          <input
            placeholder="Search user..."
            className="border p-2 rounded w-72"
          />

          <select className="border p-2 rounded">
            <option>All Role</option>
            <option>User</option>
            <option>Admin</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="p-3">ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.id}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm">
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="p-3 space-x-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                      Edit
                    </button>

                    <button className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                      Block
                    </button>

                    <button className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
