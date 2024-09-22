import React, { useState } from "react";
import GoogleLogin from "./GoogleLogin";
import { useNavigate } from "react-router-dom";
import api from "../axioxConfig";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Trigger reCaptcha v3
    const token = await window.grecaptcha.execute(
      "6LfUq0sqAAAAAM2ZpqbQz4FaPEURjaTQDSZLANug",
      { action: "submit" }
    );
    try {
      const response = await api.post("/auth/signup", {
        username,
        email,
        password,
        captcha: token,
      });

      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessage("Signup Failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Signup</h2>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
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

        <button type="submit">Signup</button>
        <p>{message}</p>
      </form>
      <h2>or</h2>
      <GoogleLogin />
    </div>
  );
};

export default SignupForm;
