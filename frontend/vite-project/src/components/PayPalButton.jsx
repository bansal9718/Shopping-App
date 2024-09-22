import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import api from "../axioxConfig"; 
import { jwtDecode } from "jwt-decode";

const PayPalButton = ({ dynamicAmount }) => {
  const token = localStorage.getItem("token"); // Get JWT from localStorage
  let userId = null;
  if (token) {
    try {
      // Decode the JWT to extract user ID
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id; 

      if (!userId) {
        console.error("User ID not found in the token");
        return;
      }
    } catch (error) {
      console.error("Error decoding the token", error);
      return;
    }
  } else {
    console.error("JWT token is missing");
    return;
  }

  const handleCreateOrder = async (data, actions) => {
    const response = await api.post(
      "/payment/create-payment",
      {
        amount: dynamicAmount, 
        userID: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data.orderId; // Return the order ID
  };

  const handleOnApprove = async (data) => {
    const response = await api.post(
      `/payment/capture-payment/${data.orderID}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Payment Successful!");
    alert(response.data.message); // Alert for PDF emailed successfully
  };

  return (
    <PayPalButtons
      createOrder={handleCreateOrder}
      onApprove={handleOnApprove}
      onError={(err) => console.error("PayPal Button Error:", err)}
    />
  );
};

export default PayPalButton;
