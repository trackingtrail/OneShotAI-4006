const jwt = require("jsonwebtoken");
const Timestamp = require("../../Models/EmailTimestampModel");

const viewTimestamp = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const email = decodedToken.email;

    const timestamp = await Timestamp.findOne({ email });

    if (!timestamp) {
      return res.status(404).json({
        message: "Timestamp not found for this email",
      });
    }

    res.status(200).json({
      message: "Timestamp retrieved successfully",
      timestamp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { viewTimestamp };
