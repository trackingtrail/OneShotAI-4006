const {
  userRegister,
} = require("../Controllers/UserHandling/UserRegistration");
const { userLogin } = require("../Controllers/UserHandling/UserLogin");
const authMiddleware = require("../Controllers/UserHandling/JWTAuth");
const {
  saveAndSendOTP,
} = require("../Controllers/UserHandling/SaveAndSendOTP");
const {
  createTimestamp,
} = require("../Controllers/UserHandling/CreateTimestamp");

const express = require("express");
const {
  deleteTimestamp,
} = require("../Controllers/UserHandling/DeleteTimeStamp");

const router = express.Router();

const { viewTimestamp } = require("../Controllers/UserHandling/ViewTimestamp");

/**
Endpoints:
- POST /register: registers a new user with a unique email and password.
- POST /login: logs in an existing user with a valid email and password.
- POST /send-otp: sends an otp to the email address.
- POST /create-timestamp: creating a timestamp.
- POST /delete-timestamp: deleting a timestamp.
- GET /view-timestamp: retrieving a timestamp.
**/

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/send-otp", saveAndSendOTP);

router.post("/create-timestamp", authMiddleware, createTimestamp);
router.delete("/delete-timestamp", authMiddleware, deleteTimestamp);
router.get("/view-timestamp", authMiddleware, viewTimestamp);

router.get("/dashboard", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Authenticated" });
});

module.exports = router;
