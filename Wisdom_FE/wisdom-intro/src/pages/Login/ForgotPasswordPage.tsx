import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
await axios.post(
  "http://localhost:8080/api/auth/send-reset-token",
  null,
  {
    params: { email }
  }
);

      alert("OTP đã gửi về email");

      navigate("/verify-otp", {
  state: {
    email: email
  }
});

    } catch {
      alert("Gửi OTP thất bại");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Quên mật khẩu
        </h2>

        <div className="mb-4">

          <label className="block mb-2 text-sm font-medium">
            Nhập email
          </label>

          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
        >
          Send OTP
        </button>

        <div className="text-center">
          <Link to="/login" className="text-blue-500 hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>

      </form>

    </div>
  );
}