const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const passport = require("passport");
const logger = require("./middleware/logger");
const apiTracker = require("./middleware/apiTracker");
const session = require("express-session");
require("./middleware/auth");
const app = express();

const authRoutes = require("./Routes/authRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const pdfRoute = require("./Routes/pdfRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");

//Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Allows all origins
  })
);
app.use(bodyParser.json());
app.use(logger);
app.use(apiTracker);

// Initialize express-session (used for session management)
app.use(
  session({
    secret: "your_secret_key", // Change this to a secure random string in production
    resave: false,
    saveUninitialized: true,
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Route Mounting

app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("api/pdf", pdfRoute);

//DB connection
connectDB();

//Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
