// creating the server
const express = require("express");
const app = express();
// import CORS
const cors = require("cors");
app.use(cors());

// check computer environment port number
const port = process.env.PORT || 3001;

const HttpError = require("../models/http-errors");
// Require artist schema file to save it:
const aComment = require("../models/CommentSchema");
const newForm = require("../models/PreFormSchema");
const Coupon = require("../models/CouponSchema");

var dotenv = require("dotenv");
dotenv.config();

// To parse a boydy to json
var bodyParser = require("body-parser");

//Add the passportJWT
const passport = require("passport");

// Add the users (routes)
// const users = require("../routes/api/users");


// CORS error: set the headers to prevent (Middleware):
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  // ---> Continue flow to other middewares
  next();
});


// Add the routes
const routes = require("../routes/theroutes");

// For user posting and requiesting
const verify = require("../routes/verifyToken");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Use router
app.use("/api", routes);

// Passport middleware
app.use(passport.initialize());

// Passport config
require("../config/passport")(passport);
require("../config/reviewPassport")(passport);

// Error handler when no endpoint or direction is found "NEXT()""
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});
// Error Middleware
// Special middleware function - Express knows is Error Handling (4 parameters)
app.use((error, req, res, next) => {
  // Find the file on the request and ERROR ---> Not save
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(`The error on file: ${err}`);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error ocurred" });
});
// Routes
// app.use("/api/users", users);

module.exports = { app, port };
