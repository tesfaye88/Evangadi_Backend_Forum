require("dotenv").config()
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { onlineStatus } = require("../controller/userController");

// checks if the token is sent 
const middleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Unauthorized",
      message: "Authentication invalid",
    });
  }

  // verifies the token sent
  try {
    const token = authHeader.split(" ")[1];
    const { username, id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { username, id};
    if (req.user){
      onlineStatus(req.user.id)
    }
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Unauthorized",
      message: "Authentication invalid",
    });
  }
};

module.exports = middleware;
