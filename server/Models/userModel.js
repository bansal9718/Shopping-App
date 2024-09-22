const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  resetToken: {
    type: String, // Field to store the reset token
    default: null, // Default value is null
  },
  resetTokenExpiry: {
    type: Date, // Field to store the expiry time of the reset token
    default: null, // Default value is null
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    unique: true,
  },
});

//Password Hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//Password Compare
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

//token generation
userSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign(
      { id: this._id, email: this.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "90d",
      }
    );

    return token;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model("User", userSchema);
