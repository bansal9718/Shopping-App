const express = require("express");
const router = express.Router();
const {
  createPayment,
  capturePayment,
} = require("../Controllers/paymentController");

const authenticateToken = require("../middleware/authMiddleware");

router.post("/create-payment", authenticateToken, createPayment);

router.post("/capture-payment/:orderId", authenticateToken, capturePayment);

module.exports = router;
