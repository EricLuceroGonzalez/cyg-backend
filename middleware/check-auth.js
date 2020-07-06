const HttpError = require("../models/http-errors");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  console.log("check auth");
  console.log(req.method);
  console.log("req.headers.authorization");
  console.log(req.headers.authorization);

  const token = req.headers.authorization.split(" ")[1]; // Bearer 'token'

  try {
    if (!token) {
      throw new Error("Authentication failed!");
    }

    // Verify token:
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // Add data to request:
    req.userData = { userId: decodedToken.userId };
    next(); // COntonue the code to the routes
  } catch (err) {
    const error = new HttpError("Authentication failed", 403);
    return next(error);
  }
};
