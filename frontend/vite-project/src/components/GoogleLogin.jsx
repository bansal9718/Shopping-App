import React from "react";
const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = "https://backend-595s.onrender.com/api/auth/google";
  };
  return <button onClick={handleGoogleLogin}>Signup with Google</button>;
};

export default GoogleLogin;
