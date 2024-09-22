import React from "react";
const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/auth/google";
  };
  return <button onClick={handleGoogleLogin}>Signup with Google</button>;
};

export default GoogleLogin;
