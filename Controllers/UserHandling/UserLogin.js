const bcrypt = require("bcrypt");
const User = require("../../Models/UserModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const generateJwtToken = (user) => {
  return jwt.sign(
    { userMongoId: user._id, email: user.email },
    process.env.JWT_SECRET
  );
};

const userLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: "Invalid request parameters" });
  }

  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateJwtToken(foundUser);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        email: foundUser.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { userLogin };
