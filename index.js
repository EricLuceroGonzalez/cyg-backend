const { app, port } = require("./server");

// const app = express();

// pull database from ./database/index.js
require("./database");

// Call heroku
// if (process.env.NODE_ENV === "production") {
//   // Bring build folder that is inside React after an npm run build
//   app.use(express.static('../client/build'));

//   app.get('/*', (req, res) => {
//     console.log(__dirname);
//     console.log(path.join(__dirname, "../client/build/index.html"));

//     res.sendFile(path.join(__dirname, "../client/build/index.html"));
//   });
// }

// Start the server
app.listen(port, () => {
  console.log(`Server running at ${port}...`);
});
