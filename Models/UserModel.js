const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
