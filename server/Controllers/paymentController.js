const paypalClient = require("../middleware/payPalClient");
const paypal = require("@paypal/checkout-server-sdk");
const Payment = require("../Models/paymentModel");
const generateInvoice = require("../middleware/generateInvoice");
const sendInvoice = require("../utils/sendInvoice");

const createPayment = async (req, res) => {
  const { amount, userID } = req.body;
  // Log incoming request data
  const user = req.user;
  // Basic validation
  if (!amount || !userID) {
    console.error("Amount or UserID is missing");
    return res.status(400).json({ message: "Amount and User ID are required" });
  }
  // Ensure the user is authenticated
  if (!user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No valid token provided" });
  }
  // Proceed with PayPal order creation using PayPal SDK
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: amount,
        },
      },
    ],
  });

  try {
    const order = await paypalClient.execute(request);

    // Log the order details for debugging

    const payment = new Payment({
      userID,
      amount,
      status: order.result.status,
      paymentId: order.result.id,
    });

    await payment.save();

    res.status(200).json({
      message: "Payment created successfully",
      orderId: order.result.id,
    });
  } catch (err) {
    console.error("Error creating PayPal payment:", err);
    res
      .status(500)
      .json({ message: "Error creating PayPal payment", error: err });
  }
};

const capturePayment = async (req, res) => {
  const { orderId } = req.params;

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await paypalClient.execute(request);

    if (capture.result.status === "COMPLETED") {
      const purchaseUnits = capture.result.purchase_units; // Correctly access the purchase_units

      if (purchaseUnits && purchaseUnits.length > 0) {
        const captures = purchaseUnits[0].payments.captures;

        if (captures && captures.length > 0) {
          const amount = captures[0].amount.value; // Access the captured amount
          const currency = captures[0].amount.currency_code; // Access the currency code

          // Generate Invoice
          const invoicePath = generateInvoice({
            id: orderId,
            amount, // Pass the amount here
          });

          // Send Invoice
          await sendInvoice(
            req.user.email,
            "Your Invoice",
            "Please find attached your invoice.",
            invoicePath
          );

          res.json({
            status: capture.result.status,
            captureId: capture.result.id,
            amount, // Optionally include the amount in the response
            currency, // Optionally include the currency in the response
            message: "Invoice has been emailed successfully!",
          });
        } else {
          console.error("No captures found in capture response.");
          return res
            .status(500)
            .send("Error capturing PayPal payment: No captures found");
        }
      } else {
        console.error("Purchase units not found in capture response.");
        return res
          .status(500)
          .send("Error capturing PayPal payment: No purchase units found");
      }
    } else {
      console.error(`Payment not completed, status: ${capture.result.status}`);
      return res
        .status(500)
        .send("Error capturing PayPal payment: Payment not completed");
    }
  } catch (err) {
    console.error("Error capturing PayPal payment:", err);
    return res.status(500).send("Error capturing PayPal payment");
  }
};
module.exports = {
  createPayment,
  capturePayment,
};
