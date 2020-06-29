// We create a Mongo db schema for this variable
// Copy from mongoose docs
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  date: {type: Date, required: false, default: Date.now },
  qAcheck: { type: String, required: true },
  qBcheck: { type: String, required: true },
  thumb: { type: String, required: true },
  comment: { type: String, required: true },
  couponId: { type: Schema.Types.ObjectId, ref: "Coupon" },
  reviewerId: { type: Schema.Types.ObjectId, ref: "Review" }
});

// Lets create (convert) this schema Model with ---> mongoose.model(modelName, schema):
const AComment = mongoose.model("AComment", commentSchema);

// Send it:
module.exports = AComment;


// Example:
// {
// "mail": "",
// "stars": "",
// "thumb": "",
// "comment": "",
// "engage": "",
// "oldUser":""}
