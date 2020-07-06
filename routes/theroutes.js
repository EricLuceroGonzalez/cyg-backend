const express = require("express");
// Import the express-validator:
const { check } = require("express-validator");

const fileUpload = require("../middleware/file-upload");
// Auth-check Middleware
const checkAuth = require("../middleware/check-auth");
const ctrl = require("./theroute-control");
const router = express.Router();

// For user posting and requiesting
// const verify = require("./verifyToken");

router.get("/comments", ctrl.getAllComments);
router.get("/coupons", ctrl.getAllCoupons);
// router.post("/createCoupon", ctrl.postCoupon);
router.get("/getCoupon/:id", ctrl.getCouponById);
router.get("/revAuth/:id", ctrl.getReviewerById);

router.post("/users/register", ctrl.userRegister);
router.post("/users/login", ctrl.userLogin);
router.post("/user/register", ctrl.reviewUserRegister);
router.post("/user/login", ctrl.reviewUserLogin);

// **********************  MIDDLEWARE To ACCESS next requests  **********************
router.use(checkAuth);

router.post("/createCoupon", ctrl.postOneCoupon);
router.post("/aComment", ctrl.postComment);
router.post("/newFormUser", ctrl.postPreForm);
router.post("/addScan/", ctrl.addOneScan);

// File Upload Middleware
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  ctrl.createPrize
);
// router.get("/reviews", ctrl. getCommentsToValidate);
module.exports = router;
