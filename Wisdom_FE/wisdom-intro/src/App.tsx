import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/Login/LoginPage";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import VerifyOtpPage from "./pages/Login/VerifyOtpPage";
import RegisterPage from "./pages/Login/RegisterPage";
import ResetPasswordPage from "./pages/Login/ResetPasswordPage";  

function App() {
  return (
    <BrowserRouter>
<Routes>

  <Route path="/" element={<Navigate to="/login" />} />

  <Route path="/login" element={<LoginPage />} />

  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

  <Route path="/verify-otp" element={<VerifyOtpPage />} />

  <Route path="/reset-password" element={<ResetPasswordPage />} />

  <Route path="/register" element={<RegisterPage />} />

</Routes>
    </BrowserRouter>
  );
}

export default App;