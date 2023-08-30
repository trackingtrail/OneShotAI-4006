const jwt = require("jsonwebtoken");
const Timestamp = require("../../Models/EmailTimestampModel");

const createTimestamp = async (req, res) => {
  try {
    const { timestamp } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const email = decodedToken.email;

    const existingTimestamp = await Timestamp.findOne({ email });

    if (existingTimestamp) {
      return res.status(400).json({
        message:
          "An appointment has previously been scheduled for this user. Please consider deleting the existing appointment before creating a new one.",
      });
    }

    const newTimestamp = new Timestamp({
      email,
      timestamp,
    });

    await newTimestamp.save();

    res.status(201).json({
      message: "Timestamp stored successfully",
      timestamp: newTimestamp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { createTimestamp };
