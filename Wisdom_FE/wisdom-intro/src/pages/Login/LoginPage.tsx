import React, { useState } from "react";
import { login } from "../../service/api/auth.api";
import { Link } from "react-router-dom";

export default function LoginPage() {

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {

    if (!form.username) {
      alert("Username không được để trống");
      return false;
    }

    if (!form.password) {
      alert("Password không được để trống");
      return false;
    }

    return true;

  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      const res = await login(form);

      // localStorage.setItem("token", res.data.token);

      alert("Login success");

    } catch {

      alert("Login failed");

    }

  };

  return (

    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        {/* username */}

        <div className="mb-4">

          <label className="block mb-2 text-sm font-medium">
            Username
          </label>

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

        </div>

        {/* password */}

        <div className="mb-4">

          <label className="block mb-2 text-sm font-medium">
            Password
          </label>

          <div className="relative">

            <input
              name="password"
              type={showPassword ? "text" : "password"}
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

        </div>

        <div className="flex justify-between mb-4">

          <Link to="/forgot-password" className="text-blue-500 text-sm">
            Forgot Password?
          </Link>

          <Link to="/register" className="text-blue-500 text-sm">
            Register
          </Link>

        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>

      </form>

    </div>

  );

}