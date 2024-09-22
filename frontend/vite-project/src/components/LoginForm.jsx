import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import api from "../axioxConfig";

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      const token = response.data.token; // Assuming you return a token from the server
      localStorage.setItem("token", token); // Store the token in localStorage

      setMessage("Login Successful");
      setTimeout(() => {
        navigate("/Home");
      }, 1000);
    } catch (error) {
      setMessage("Login Failed");
    }
  };

  const handleGoogleLoginClick = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>

        <p>{message}</p>
      </form>

      <p>Forgot Password?</p>
      <button onClick={() => navigate("/reset-password")}>
        Reset Password
      </button>
    </div>
  );
};

export default LoginForm;
