const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  scanNumber: { type: Number, required: true, default: 0 },
  scaninfo: [
    {
      scanDate: { type: Date, required: false },
      scanReviewer: {
        type: String
        // type: Schema.Types.ObjectId,
        // ref: "Review",
        // required: false
      }
    }
  ],
  creationDate: { type: Date, required: true, default: Date.now },
  condiciones: [{ type: String, required: false }],
  direccion: [{ type: String, required: false }],
  questionA: { type: String, required: false, default: "Pregunta A" },
  questionB: { type: String, required: false, default: "Pregunta B" },
  qr: { type: String, default: "The QR file/" },
  cantidad: { type: String, required: false, default: 25 },
  category: { type: String, required: false, default: "" },
  address: [{ type: String, required: false }],
  offer: {
    expirationDate: { type: Date, required: false },
    startingDate: { type: Date, required: false },
    titulo: { type: String, required: false },
    description: { type: String, required: false }
  },
  product: {
    name: { type: String, required: false },
    description: { type: String, required: false },
    priceOriginal: { type: Number, required: false },
    discount: { type: Number, required: false },
    image: { type: String, required: false },
    priceFinal: { type: Number, required: false },
    cost: { type: Number, required: false },
    youSave: { type: Number, required: false }
  }
});

// Lets create (convert) this schema Model with ---> mongoose.model(modelName, schema):
const Coupon = mongoose.model("Coupon", couponSchema);

// Send it:
module.exports = Coupon;
