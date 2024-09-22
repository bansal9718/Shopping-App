import { React, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axioxConfig";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        newPassword: newPass,
        reEnterNewPassword: confirmNewPass,
        token, // Ensure this token is included
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/Home");
      }, 2000);
    } catch (error) {
      console.error("Password Change Failed", error);
      setMessage(error.response?.data?.message || "An error Occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmNewPass}
            onChange={(e) => setConfirmNewPass(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
