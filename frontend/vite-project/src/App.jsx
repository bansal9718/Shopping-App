import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import SendResetPassword from "./components/SendResetPassword";
import GoogleLogin from "./components/GoogleLogin";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import { AuthProvider } from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./components/ResetPassword";

const App = () => {
  return (
    <AuthProvider> {/* Wrap the entire app or Routes that may need authentication */}
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/password-reset/:token" element={<ResetPassword />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/reset-password" element={<SendResetPassword />} />
          <Route path="/google-login" element={<GoogleLogin />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/Home" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
