const mongoose = require("mongoose");

const timestampSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Timestamp = mongoose.model("Timestamp", timestampSchema);

module.exports = Timestamp;
