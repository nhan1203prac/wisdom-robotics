import { useState } from "react";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export default function CreateEmployee() {
  const [employeeId, setEmployeeId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/create-employee",
        {
          method: "POST",
          credentials: "include", // QUAN TRỌNG: gửi cookie
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId,
            phone,
            email,
          }),
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      alert(data.message);

      // reset form
      setEmployeeId("");
      setPhone("");
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="w-[400px] bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Employee Account
        </h2>

        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <input
            type="text"
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="text"
            placeholder="Phone (Password)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
