// For Login and Register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const { validationResult } = require("express-validator");

// Load User model
const User = require("../models/UserSchema");
const Review = require("../models/ReviewSchema");
const aComment = require("../models/CommentSchema");
const PreForm = require("../models/PreFormSchema");
const Coupon = require("../models/CouponSchema");
const HttpError = require("../models/http-errors");
// For user posting and requiesting
const verify = require("../routes/verifyToken");

getAllComments = (req, res) => {
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAA");

  aComment
    .find()
    .then((newForm) => res.status(200).send(newForm))
    .catch((err) => res.status(400).send(err));
};

postPreForm = (req, res) => {
  if (!req.body) {
    console.log("there is no body to send");
    return res.status(400).json({
      success: false,
      error: "There is an error on get all comments",
    });
  }
  const newForm = new PreForm(req.body);

  newForm
    .save()
    .then(() => {
      return res.status(200).json({
        success: true,
        id: newForm._id,
        message: "Form submitted!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Form not created!",
      });
    });
};

postComment = (req, res) => {
  console.log("inside  postComment");
  console.log(req.body);

  if (!req.body) {
    console.log("there is no body to send");
    return res.status(400).json({
      success: false,
      error: "There is an error on get all comments",
    });
  }

  // Guardar en db
  const newComment = new aComment(req.body);
  newComment
    .save()
    .then(() => {
      return res.status(200).json({
        success: true,
        id: newComment._id,
        message: "Comment created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        success: false,
        message: `Comment not created!. \n Error: ${error}`,
      });
    });
  //   newComment.save((err, newComment) => {
  //     return err
  //       ? res.status(400).send({ mensaje: "Hay un error", res: err })
  //       : res.status(200).send({ mensaje: "Comment guardado", res: newComment });
  //   });
};

postCoupon = (req, res) => {
  const newCoupon = new Coupon({
    user: req.user._id,
    content: req.body.content,
  });

  try {
    const coupon = newCoupon.save();
    const couponWithUser = Coupon.findById(coupon._id).populate("user");
    res.send(couponWithUser);
  } catch (err) {
    res.status(400).send(err);
  }
};

postOneCoupon = (req, res) => {
  console.log("\n\n\n-----------------------------");
  console.log(req.body);
  console.log("\n--------- user --------------------");
  console.log(req.body.user);
  const newCoupon = new Coupon(req.body);

  newCoupon
    .save()
    .then(() => {
      return res.status(200).json({
        success: true,
        id: newCoupon._id,
        message: "Coupon created!",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        id: newCoupon._id,
        message: `Some Error: ${err}`,
      });
    });
};

getAllCoupons = (req, res) => {
  Coupon.find()
    .populate("user")
    .then((coupon) => res.status(200).send(coupon))
    .catch((err) => res.status(400).send(err));
  // Coupon.find()
  //   .then(coupon => res.status(200).send(coupon))
  //   .catch(err => res.status(400).send(err));
};

getCouponById = (req, res) => {
  console.log(`The id params: ${req.params.id}`);
  Coupon.findById(req.params.id)
    .then((coupon) => res.status(200).send(coupon))
    .catch((err) => res.status(400).send(err));
  // Coupon.find()
  //   .then(coupon => res.status(200).send(coupon))
  //   .catch(err => res.status(400).send(err));
};

// User Register

userRegister = async (req, res, next) => {
  // Form validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(
      "Hay algún dato no valido, por favor revisa tus datos",
      422
    );
    return next(error);
  }

  const { name, email, password, password2 } = req.body;

  // check if passwords are equal
  if (password !== password2) {
    const error = new HttpError(
      "Las contraseñas no coinciden, verifica tus datos.",
      500
    );
    return next(error);
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Hemos tenido un error verificando tus datos, por favor inténtalo de nuevo.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "Ya existe un usuario con esta información, has un Login.",
      422
    );
    return next(error);
  }

  // With bycrpt we HASH the password from incoming request:
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Hemos tenido un problema verificando tu información, por favor inténtalo de nuevo.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword, // Store the hashed password
  });

  //   Create USER ---> save() to Mongo, as async => await
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Hemos tenido un error en la creación del usuario, por favor inténtalo de nuevo.",
      500
    );
    return next(error);
  }
  // generate TOKEN
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, name: createdUser.name },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Hubo un error, por favor inténtalo de nuevo.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    userId: createdUser.id,
    userName: createdUser.name,
    token: token,
  });
};

userLogin = async (req, res, next) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body); // Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Tuvimos un error al verificar tu email, por favor inténtalo de nuevo.",
      500
    );
    return next(error);
  }
  //   CHECK IF EMAIL IS CORRECT (dummy version)
  if (!existingUser) {
    const error = new HttpError(
      "No pudimos encontrar este usuario, por favor regístrate",
      403
    );
    return next(error);
  }

  // Check the password, compare to the encrypted and give a token
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "No pudimos verificar tus datos, por favor inténtalo de nuevo.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "La contraseña no es válida, por favor inténtalo de nuevo.",
      403
    );
    return next(error);
  }

  // generate TOKEN
  let token;
  try {
    const payload = {
      id: existingUser.id,
      name: existingUser.name,
    };

    token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1h" });
  } catch (err) {
    const error = new HttpError(
      "Hubo un error, por favor inténtalo de nuevo.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    userId: existingUser.id,
    userName: existingUser.name,
    email: existingUser.email,
    token: token,
  });
};

// Review User Register and Login

reviewUserRegister = (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Review.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newReviewUser = new Review({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        birthdate: req.body.birthdate,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newReviewUser.password, salt, (err, hash) => {
          if (err) throw err;
          newReviewUser.password = hash;
          newReviewUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
};

reviewUserLogin = (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body); // Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  Review.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // Review matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3200,
            // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
};

// Get reviewer
getReviewerById = (req, res) => {
  console.log(`The id params: ${req.params.id}`);
  Review.findById(req.params.id).then((respon) => res.status(200).send(respon));
};

// The Update Methods
addOneScan = (req, res) => {
  console.log("asd");

  console.log(req.params);
  // console.log(req.params.a);
  // console.log(req.params.b);

  // Coupon.findByIdAndUpdate(
  //   req.params.a,
  //   { $inc: { scanNumber: 1 } },
  // $push: { scanInfo:{scanDate: Date.now(), scanReviewer: 'A'} } },
  //   { new: true }
  // )
  //   .then(UpdateCoupon => res.status(200).send(UpdateCoupon))
  //   .catch(UpdateCoupon => res.status(400).send(UpdateCoupon));
};

createPrize = (req, res, next) => {
  // Call validation RESULT before, to check validity
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError("Invalid inputs, please check your data", 422);
    return next(error);
  }
  // instead of 'const title = req.body.title' ... we do:
  const { title, description, name } = req.body;
};

module.exports = {
  createPrize,
  getAllComments,
  postPreForm,
  postComment,
  postCoupon,
  postOneCoupon,
  getAllCoupons,
  userRegister,
  userLogin,
  getCouponById,
  reviewUserLogin,
  reviewUserRegister,
  getReviewerById,
  addOneScan,
};
