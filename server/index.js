// creating the server
const express = require("express");
const app = express();
// import CORS
const cors = require("cors");
app.use(cors());

// check computer environment port number
const port = process.env.PORT || 3001;

// // Require artist schema file to save it:
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
// Routes
// app.use("/api/users", users);

// When some one calls .get() we catch the request data and send a response data

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

// app.post("/api/createCoupon/add", (req, res) => {
//   console.log("\n\n\n-----------------------------");
//   console.log(req.body);
//   console.log("\n--------- user --------------------");
//   console.log(req.body.user);
//   console.log("\n--------- body -------------------");
//   console.log(req.body.content);

//   // console.log(`\n\n user id: ${req.body.user.user.id}`);
//   // user: req.body.user.user.id,
//   const newCoupon = new Coupon(req.body);

//   // try {
//     console.log("\n try----------");

//     const coupon = newCoupon.save();
//     console.log("save----------");

//     // const couponWithUser = Coupon.findById(coupon._id).populate("user");
//     // "user": "5dff19587dc0994532c58759",

//     console.log("save id  ----------");
//     res.status(200).send({ message: "Ok", res: req.body });
//   // } catch (err) {
//   //   console.log("Errirrrr");
//   //   res.status(400).send(err);
//   // }
// });

// initi CRUD -------------
// The CRUD things

// app.get("/comments", (req, res) => {
//   // find() all comments from db

//   aComment
//     .find()
//     .then(newForm => res.status(200).send(newForm))
//     .catch(err => res.status(400).send(err));
// });

// //  C: CREATE ------------
// app.post("/api/v1/aComment", (req, res) => {
//   // Recibir el comment
//   console.log(req.body);

//   // Guardar en db
//   const newComment = new aComment(req.body);
//   newComment.save((err, newComment) => {
//     return err
//       ? res.status(400).send({ mensaje: "Hay un error", res: err })
//       : res.status(200).send({ mensaje: "Comment guardado", res: newComment });
//   });
// });

// Send variable when this file is "require"
module.exports = { app, port };
