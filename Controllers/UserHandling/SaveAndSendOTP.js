const Joi = require("joi");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const OTPVerification = require("../../Models/OTPModel");
const User = require("../../Models/UserModel");

const saveAndSendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    const { error } = schema.validate({ email });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return res.status(409).json({
        message:
          "This email has already been registered or is going through OTP verification",
      });
    }

    const verificationCode = crypto.randomBytes(3).toString("hex");

    const otpDocument = new OTPVerification({
      verificationCode,
      email,
    });

    try {
      await otpDocument.save();
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Failed to save OTP to database",
      });
    }

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_GMAIL_SAFE_APP_EMAIL,
        pass: process.env.GOOGLE_GMAIL_SAFE_APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GOOGLE_GMAIL_SAFE_APP_EMAIL,
      to: email,
      subject: "Your OTP for registration",
      text: `Hello,\nYour OTP for registration is: ${verificationCode}. This OTP is valid for the next 10 minutes only.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "OTP saved successfully",
      otpDocumentId: otpDocument._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const checkEmailExists = async (email) => {
  const emailExists = await Promise.all([
    User.exists({ email }),
    OTPVerification.exists({ email }),
  ]);
  return emailExists.some((exists) => exists);
};

module.exports = { saveAndSendOTP };
