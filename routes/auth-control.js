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
// const Review = require("../models/ReviewSchema");
// const aComment = require("../models/CommentSchema");
// const PreForm = require("../models/PreFormSchema");
// const Coupon = require("../models/CouponSchema");
const HttpError = require("../models/http-errors");


// User Register
userRegister = async (req, res, next) => {
    console.log('\n\t__________ User Register__________');
    
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
      { expiresIn: "48h" }
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
    console.log('login Register');
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

module.exports = {
  userLogin,
  userRegister,
};
