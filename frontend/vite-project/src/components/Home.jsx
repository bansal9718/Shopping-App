import { React, useState } from "react";
import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalButton from "./PayPalButton";
import Logout from "./Logout";

const Home = () => {
  const { isAuthenticated, loading } = useAuth();
  const [amount, setAmount] = useState("10.00"); // Default amount
  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="login" />;
  }
  const handleAmountChange = (e) => {
    setAmount(e.target.value); // Update the amount based on user input
  };
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "ASyNKO5SlxMIRDoLItqzzTz5AUNv_TS_Ul7FKnqKE4duv_Oyp9VOxls_Cz31wfHFDXWkIM9MmVDFQoBH",
      }}
    >
      <h1>Welcome to the Dashboard</h1>
      <h2>Make the Payment</h2>
      <input
        type="number"
        step="0.01" // Allow decimal input
        value={amount}
        onChange={handleAmountChange}
        placeholder="Enter amount"
        min="0.01" // Prevent zero or negative amounts
        required
      />
      <Logout />
      <PayPalButton dynamicAmount={amount} />
    </PayPalScriptProvider>
  );
};

export default Home;
