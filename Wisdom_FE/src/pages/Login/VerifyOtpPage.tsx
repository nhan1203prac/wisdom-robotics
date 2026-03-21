import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

export default function VerifyOtpPage() {

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // countdown resend OTP
  useEffect(() => {

    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [countdown]);

  // validate OTP
  const validateOtp = () => {

    const otpRegex = /^[0-9]{6}$/;

    if (!otpRegex.test(otp)) {
      alert("OTP phải gồm 6 chữ số");
      return false;
    }

    return true;

  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!email) {
      alert("Không tìm thấy email. Vui lòng nhập lại email.");
      navigate("/forgot-password");
      return;
    }

    if (!validateOtp()) return;

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/auth/verify-otp",
        {
          email,
          otp
        }
      );

      if (res.data.success) {

        alert("OTP hợp lệ");

        navigate("/reset-password", {
          state: { email, otp }
        });

      }

    } catch {

      alert("OTP sai hoặc đã hết hạn");

    } finally {
      setLoading(false);
    }

  };

  // resend OTP
  const handleResendOtp = async () => {

    try {

      await axios.post(
        "http://localhost:8080/api/auth/send-reset-token",
        null,
        {
          params: { email }
        }
      );

      alert("OTP mới đã được gửi");

      setCountdown(60);

    } catch {

      alert("Không thể gửi lại OTP");

    }

  };

  return (

    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Nhập mã OTP
        </h2>

        <input
          type="text"
          placeholder="Nhập OTP từ email"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {loading ? "Đang xác nhận..." : "Xác nhận OTP"}
        </button>

        {/* resend OTP */}

        <div className="text-center mt-4 text-sm">

          {countdown > 0 ? (
            <p className="text-gray-500">
              Gửi lại OTP sau {countdown}s
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-500 hover:underline"
            >
              Gửi lại mã OTP
            </button>
          )}

        </div>

        {/* back */}

        <div className="text-center mt-4">

          <Link
            to="/forgot-password"
            className="text-blue-500 hover:underline text-sm"
          >
            ← Quay lại nhập email
          </Link>

        </div>

      </form>

    </div>

  );

}