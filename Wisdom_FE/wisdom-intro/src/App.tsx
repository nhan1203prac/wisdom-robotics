import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import ForgotPasswordPage from "./pages/Login/ForgotPasswordPage";
import VerifyOtpPage from "./pages/Login/VerifyOtpPage";
import RegisterPage from "./pages/Login/RegisterPage";
import ResetPasswordPage from "./pages/Login/ResetPasswordPage";  
import PostPage from "./pages/Post/PostPage";

import { useAuth } from "./context/AuthContext";
import CreatePostPage from "./pages/Post/CreatePostPage";
import PostDetailPage from "./pages/Post/PostDetailPage";

function App() {

  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} replace />} />

        <Route
          path="/home"
          element={user ? <PostPage currentUser={user} /> : <Navigate to="/login" replace />}
        />
        <Route path="/posts/:id" element={<PostDetailPage currentUser={user} />} />

        <Route path="/create-post" 
          element={user ? <CreatePostPage/> : <Navigate to="/login" replace/>}/>

        <Route path="/edit-post/:id" element={<CreatePostPage />} />

        <Route
          path="/login"
          element={<LoginPage />  }
        />

        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/home" replace />}
        />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* <Route path="*" element={<Navigate to={user ? "/home" : "/login"} replace />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;