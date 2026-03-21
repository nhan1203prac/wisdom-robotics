import React, { useState } from "react";

/* ================= TYPES ================= */

interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "User";
  status: "Active" | "Blocked";
}

type CreateUserData = {
  name: string;
  email: string;
  role: "Admin" | "User";
};

/* ================= MAIN COMPONENT ================= */

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
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
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  /* ================= FILTER ================= */

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = roleFilter === "All" || u.role === roleFilter;

    return matchSearch && matchRole;
  });

  /* ================= STATS ================= */

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const blockedUsers = users.filter((u) => u.status === "Blocked").length;
  const adminUsers = users.filter((u) => u.role === "Admin").length;

  /* ================= CRUD ================= */

  const addUser = (user: User) => {
    setUsers([user, ...users]);
  };

  const updateUser = (updated: User) => {
    setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
  };

  const deleteUser = (id: number) => {
    if (!confirm("Bạn chắc chắn muốn xóa user?")) return;
    setUsers(users.filter((u) => u.id !== id));
  };

  const toggleBlock = (id: number) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "Active" ? "Blocked" : "Active",
            }
          : u,
      ),
    );
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Add User
        </button>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Active Users" value={activeUsers} />
        <StatCard title="Blocked Users" value={blockedUsers} />
        <StatCard title="Admins" value={adminUsers} />
      </div>

      {/* FILTER */}

      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search user..."
          className="border px-3 py-2 rounded w-[260px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Role</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </div>

      {/* TABLE */}

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b text-gray-600 text-sm">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{user.id}</td>

                <td>{user.name}</td>

                <td>{user.email}</td>

                {/* ROLE */}

                <td>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      user.role === "Admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* STATUS */}

                <td>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                {/* ACTION */}

                <td className="space-x-2">
                  <button
                    onClick={() => setEditUser(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleBlock(user.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    {user.status === "Active" ? "Block" : "Unblock"}
                  </button>

                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onSave={(data) => {
            const newUser: User = {
              id: Date.now(),
              name: data.name,
              email: data.email,
              role: data.role,
              status: "Active",
            };

            addUser(newUser);
            setShowCreate(false);
          }}
        />
      )}

      {/* EDIT MODAL */}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={(data) => {
            updateUser(data);
            setEditUser(null);
          }}
        />
      )}
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-400 text-sm">{title}</p>

      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

/* ================= CREATE MODAL ================= */

function CreateUserModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: CreateUserData) => void;
}) {
  const [form, setForm] = useState<CreateUserData>({
    name: "",
    email: "",
    role: "User",
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 w-[420px] rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create User</h2>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-3 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <select
          className="border p-2 w-full mb-4 rounded"
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value as "Admin" | "User",
            })
          }
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= EDIT MODAL ================= */

function EditUserModal({
  user,
  onClose,
  onSave,
}: {
  user: User;
  onClose: () => void;
  onSave: (data: User) => void;
}) {
  const [form, setForm] = useState<User>(user);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 w-[420px] rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <input
          className="border p-2 w-full mb-3 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <select
          className="border p-2 w-full mb-4 rounded"
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value as "Admin" | "User",
            })
          }
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={() => onSave(form)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
