const axios = require("axios");
const User = require("../Models/userModel");
const crypto = require("crypto");
const { sendResetEmail } = require("../utils/email");

//Signup Route
exports.signup = async (req, res) => {
  const { username, email, password, captcha } = req.body;

  if (!username || !email || !password || !captcha) {
    return res.status(400).json({ message: "Fill in all details" });
  }
  try {
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=6LfUq0sqAAAAAKtJW0Hr7YF987MHpxYEluA6vRhu&response=${captcha}`;
    const verificationResponse = await axios.post(verificationUrl);
    const { success, score } = verificationResponse.data;

    if (!success) {
      return res.status(400).json({
        message: "Failed reCAPTCHA verification",
        errors: verificationResponse.data["error-codes"],
      });
    }

    if (!success || score < 0.5) {
      return res.status(400).json({ message: "Failed reCAPTCHA verification" });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      username,
      email,
      password,
    });

    return res.status(200).json({ message: "Signup Successful", user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Login Route

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please Provide All details" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = await user.generateToken();
    if (!token) {
      return res.status(400).json({ message: "Token generation failed" });
    }
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
    console.error(error);
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

//Password Reset
exports.sendResetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    await sendResetEmail(user.email, resetToken);

    res.status(200).json({ message: "Reset email sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reset email", err });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, reEnterNewPassword, token } = req.body;

  const user = await User.findOne({
    email,
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (newPassword != reEnterNewPassword) {
    return res.status(404).json({ message: "Passwords do not Match" });
  }
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  //Hash the password

  try {
    // const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);

    return res.status(404).json({ message: "Internal Server Error" });
  }
};
