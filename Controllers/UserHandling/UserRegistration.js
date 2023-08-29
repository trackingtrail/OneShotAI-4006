const bcrypt = require("bcrypt");
const Joi = require("joi");
const User = require("../../Models/UserModel");
const OTPVerification = require("../../Models/OTPModel");

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const userRegister = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).max(75).required(),
    }).messages({
      "string.base": `{#label} must be a string`,
      "string.empty": `{#label} is required`,
      "string.min": `{#label} must be at least {#limit} characters long`,
      "string.max": `{#label} must not exceed {#limit} characters`,
      "any.required": `{#label} is required`,
      "string.email": `Please provide a valid email address`,
    });

    // Validate user inputs
    const { error } = schema.validate({ email, password });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Check if email already exists in the database
    const emailExists = await User.exists({ email });
    if (emailExists) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Verify OTP and get the OTPVerification document
    const otpDocument = await OTPVerification.findOne({ email });
    if (!otpDocument) {
      return res.status(404).json({
        message: "OTP verification failed",
      });
    }

    if (otp !== otpDocument.verificationCode) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    await OTPVerification.deleteOne({ _id: otpDocument._id });

    res.status(201).json({
      message: "User created successfully",
      user: {
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { userRegister };
