const mongoose = require("mongoose");

const OTPVerificationSchema = new mongoose.Schema({
  verificationCode: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OTPVerification = mongoose.model(
  "OTPVerification",
  OTPVerificationSchema
);

module.exports = OTPVerification;
