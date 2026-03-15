import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import axios from "axios";

export default function ChangePasswordPage() {

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:8080/api/auth/change-password",
        form
      );

      alert(res.data.message);

    } catch (error) {
      console.error(error);
      alert("Change password failed");
    }

  };

  return (

    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          Change Password
        </h2>

        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Change Password
        </button>

      </form>

    </div>
  );
}