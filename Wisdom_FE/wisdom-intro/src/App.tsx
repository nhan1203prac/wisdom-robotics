import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ==================== AUTH ====================
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Login/RegisterPage";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import VerifyOtpPage from "./pages/Login/VerifyOtpPage";
import ResetPasswordPage from "./pages/Login/ResetPasswordPage";
import ChangePasswordPage from "./pages/Login/ChangePasswordPage";

// ==================== USER ====================
import UserHome from "./pages/home/User/UserHome";
import PostPage from "./pages/Post/PostPage";
import CreatePostPage from "./pages/Post/CreatePostPage";
import PostDetailPage from "./pages/Post/PostDetailPage";

// ==================== ADMIN ====================
import AdminDashboard from "./pages/home/Admin/AdminDashoard";
import QuanLyBlog from "./pages/home/Admin/QuanLyBlog";
import UserManagement from "./pages/home/Admin/UserManagement";
import ProductDashboard from "./pages/home/Admin/Module Service/ProductDashboard";
import CreateEmployee from "./pages/home/Admin/CreateEmployee";

// ==================== EMPLOYEE ====================
import EmployeeDashboard from "./pages/home/Employee/EmployeeDashboard";

// ==================== ORDER ====================
import CartPage from "./pages/home/orders/CartPage";
import CheckoutPage from "./pages/home/orders/CheckoutPage";
import PaymentPage from "./pages/home/orders/PaymentPage";
import InvoicePage from "./pages/home/orders/InvoicePage";
import OrderTrackingPage from "./pages/home/orders/OrderTrackingPage";
import OrdersPage from "./pages/home/orders/OrdersPage";

// ==================== CONTEXT ====================
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>

        {/* ===================== ROOT ===================== */}
        <Route
          path="/"
          element={<Navigate to={user ? "/home" : "/login"} replace />}
        />

        {/* ===================== AUTH ===================== */}
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/home" replace />}
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />

        {/* ===================== USER ===================== */}
        <Route
          path="/home"
          element={user ? <UserHome /> : <Navigate to="/login" replace />}
        />

        {/* Post */}
        <Route
          path="/posts"
          element={user ? <PostPage currentUser={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/posts/:id"
          element={<PostDetailPage currentUser={user} />}
        />
        <Route
          path="/create-post"
          element={user ? <CreatePostPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/edit-post/:id"
          element={user ? <CreatePostPage /> : <Navigate to="/login" replace />}
        />

        {/* ===================== ADMIN ===================== */}
        <Route
          path="/admin"
          element={user ? <AdminDashboard /> : <Navigate to="/login" replace />}
        />
        <Route path="/admin/blog" element={<QuanLyBlog />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/products" element={<ProductDashboard />} />
        <Route path="/admin/create-employee" element={<CreateEmployee />} />

        {/* ===================== EMPLOYEE ===================== */}
        <Route path="/employee" element={<EmployeeDashboard />} />

        {/* ===================== ORDER ===================== */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/invoice/:orderId" element={<InvoicePage />} />
        <Route path="/track/:orderId" element={<OrderTrackingPage />} />
        <Route path="/orders" element={<OrdersPage />} />

        {/* ===================== FALLBACK ===================== */}
        <Route
          path="*"
          element={<Navigate to={user ? "/home" : "/login"} replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;