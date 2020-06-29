// We create a Mongo db schema for this variable
// Copy from mongoose docs
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PreFormSchema = new Schema({
  date: { type: Date, required: true },
  email: { type: String, required: true },
  receivePromos: { type: Boolean, required: false },
  thumb: { type: Boolean, required: false },
  contact: { type: String, required: false }
});

// Lets create (convert) this schema Model with ---> mongoose.model(modelName, schema):
const mailForm = mongoose.model("mailForm", PreFormSchema);

// Send it:
module.exports = mailForm;


// Example:
// {
// "mail": "",
// "stars": "",
// "thumb": "",
// "comment": "",
// "engage": "",
// "oldUser":""}
