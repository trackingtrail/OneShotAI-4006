const jwt = require("jsonwebtoken");
const Timestamp = require("../../Models/EmailTimestampModel");

const deleteTimestamp = async (req, res) => {
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

    const deletedTimestamp = await Timestamp.findOneAndDelete({ email });

    if (!deletedTimestamp) {
      return res.status(404).json({
        message: "Timestamp not found",
      });
    }

    res.status(200).json({
      message: "Timestamp deleted successfully",
      timestamp: deletedTimestamp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { deleteTimestamp };