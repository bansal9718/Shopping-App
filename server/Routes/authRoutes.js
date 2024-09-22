const express = require("express");
const {
  signup,
  login,
  resetPassword,
  sendResetPassword,
  logout,
} = require("../Controllers/authController");
const passport = require("passport");
const router = express.Router();

// Signup route
router.route("/signup").post(signup);

// Login route
router.route("/login").post(login);
router.route("/logout").post(logout);

// Sending Reset Password link route
router.route("/reset").post(sendResetPassword);
// Reset Password
router.route("/reset-password").post(resetPassword);

// Route to initiate Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback URL
router
  .route("/google/callback")
  .get(
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      // Successful authentication, redirect or send a token
      res.redirect("http://localhost:5173/Home"); // Redirect to your desired route or send a response
    }
  );

// Logout route
router.get("/logout", (req, res) => {
  req.logout(); // Passport.js logout method
  res.redirect("/"); // Redirect user to homepage or login page after logout
});

module.exports = router;
