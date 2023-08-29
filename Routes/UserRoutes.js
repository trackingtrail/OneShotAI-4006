const {
  userRegister,
} = require("../Controllers/UserHandling/UserRegistration");
const { userLogin } = require("../Controllers/UserHandling/UserLogin");
const authMiddleware = require("../Controllers/UserHandling/JWTAuth");
const {
  saveAndSendOTP,
} = require("../Controllers/UserHandling/SaveAndSendOTP");

const express = require("express");
const router = express.Router();

/**
Endpoints:
- POST /register: registers a new user with a unique email and password.
- POST /login: logs in an existing user with a valid email and password.
- POST /send-otp: sends an otp to the email address.
**/

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/send-otp", saveAndSendOTP);

module.exports = router;
