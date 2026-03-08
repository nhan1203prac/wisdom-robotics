import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const otp = location.state?.otp;

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      alert("Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 số");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:8080/api/auth/reset-password",
        {
          email: email,
          otp: otp,
          newPassword: password
        }
      );

      if (res.data.success) {

        alert("Đổi mật khẩu thành công");

        // chuyển về login
        navigate("/login");

      }

    } catch {

      alert("Đổi mật khẩu thất bại");

    }

  };

  return (

    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Đặt mật khẩu mới
        </h2>

        {/* input + icon mắt */}

        <div className="relative mb-3">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded pr-10"
            required
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 cursor-pointer text-gray-500"
          >
            {showPassword ? "🙈" : "👁"}
          </span>

        </div>

        {/* validate rule */}

        <p className="text-sm text-gray-500 mb-4">
          Mật khẩu phải có ít nhất <b>8 ký tự</b>, <b>1 chữ hoa</b> và <b>1 số</b>
        </p>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Đổi mật khẩu
        </button>

      </form>

    </div>

  );

}