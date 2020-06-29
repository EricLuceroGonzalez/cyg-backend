const express = require("express");

const ctrl = require("./theroute-control");
const router = express.Router();
// For user posting and requiesting
// const verify = require("./verifyToken");

router.get("/comments", ctrl.getAllComments);
router.get("/coupons", ctrl.getAllCoupons);
// router.post("/createCoupon", ctrl.postCoupon);
router.get("/getCoupon/:id", ctrl.getCouponById);
router.post("/createCoupon", ctrl.postOneCoupon);
router.post("/aComment", ctrl.postComment);
router.post("/newFormUser", ctrl.postPreForm);
router.post("/users/register", ctrl.userRegister);
router.post("/users/login", ctrl.userLogin);
router.post("/user/register", ctrl.reviewUserRegister);
router.post("/user/login", ctrl.reviewUserLogin);
router.get("/revAuth/:id", ctrl.getReviewerById);
router.post("/addScan/", ctrl.addOneScan);
// router.get("/reviews", ctrl. getCommentsToValidate);
module.exports = router;
