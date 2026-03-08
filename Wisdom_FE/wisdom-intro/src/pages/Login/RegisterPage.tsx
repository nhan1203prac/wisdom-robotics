import { useState } from "react";
import { register } from "../../service/api/auth.api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type RegisterForm = {
  username: string;
  password: string;
  email: string;
  phone: string;
};

export default function RegisterPage() {

  const [form, setForm] = useState<RegisterForm>({
    username: "",
    password: "",
    email: "",
    phone: ""
  });

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // validate
  const validateForm = () => {

    if (form.username.length < 3) {
      alert("Username phải ít nhất 3 ký tự");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Email không hợp lệ");
      return false;
    }

    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(form.phone)) {
      alert("Số điện thoại phải từ 9-11 số");
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      alert("Password phải có ít nhất 8 ký tự, 1 chữ hoa và 1 số");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {

      const res = await register(form);

      alert(res.message || "Register success");

// chuyển sang trang login
navigate("/login");
    } catch (err) {

      console.error(err);
      alert("Register failed");

    }

  };

  return (

    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        {/* username */}

        <label className="block mb-2 text-sm font-medium">
          Username
        </label>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        {/* email */}

        <label className="block mb-2 text-sm font-medium">
          Email
        </label>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        {/* phone */}

        <label className="block mb-2 text-sm font-medium">
          Phone
        </label>

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded" pattern="0[0-9]{9}"
       title="Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số"
       required
        />

        {/* password */}

        <label className="block mb-2 text-sm font-medium">
          Password
        </label>

        <div className="relative mb-4">

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
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

        <Link to="/login" className="text-blue-500">
          Bạn đã có tài khoản? Login
        </Link>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>

      </form>

    </div>

  );

}