// Create varible that ...

// ... manage Mongoose
const mongoose = require("mongoose");

prod_db = process.env.DB_URI,
test_db = process.env.DB_TEST,

mongoose.connect(
  prod_db,
  // test_db,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) {
      console.log("MongoDB - Conexion exitosa :):");
    } else {
      console.log(`Error en conexion: \n ${err}`);
    }
  }
);
