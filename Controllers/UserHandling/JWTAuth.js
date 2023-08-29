const jwt = require("jsonwebtoken");

const BEARER_PREFIX = "Bearer";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing",
    });
  }

  try {
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== BEARER_PREFIX || !token) {
      return res.status(401).json({
        message: "Invalid Authorization header",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    let errorMessage;
    switch (error.name) {
      case "TokenExpiredError":
        errorMessage = "Token expired";
        break;
      case "JsonWebTokenError":
        errorMessage = "Invalid token";
        break;
      default:
        errorMessage = "An error occurred";
    }
    res.status(401).json({
      message: errorMessage,
    });
  }
};

module.exports = authMiddleware;
