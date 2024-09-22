import React, { useState } from "react";
import api from "../axioxConfig";

const SendResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/reset", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error Sending Password Reset Mail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loading}>
          {loading ? "Sending e-mail" : "Send Reset Link"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SendResetPassword;
