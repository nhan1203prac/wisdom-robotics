import api from "../api/api";
import type { RegisterRequest, LoginRequest } from "../../types/auth.type";

export const register = async (data: RegisterRequest) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

/* ============================= */
/* SEND OTP */
/* ============================= */

export const sendOtp = async (email: string) => {
  const res = await api.post(`/auth/send-reset-token?email=${email}`);
  return res.data;
};

/* ============================= */
/* VERIFY OTP */
/* ============================= */

export const verifyOtp = async (email: string, otp: string) => {
  const res = await api.post("/auth/verify-otp", {
    email,
    otp,
  });
  return res.data;
};

/* ============================= */
/* RESET PASSWORD */
/* ============================= */

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const res = await api.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });

  return res.data;
};