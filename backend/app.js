require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// app.use(cors({
//   origin: "http://localhost:3002", // frontend URL
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// }));

// ------ Allow multiple origins ------
const allowedOrigins = [
  "http://localhost:3001", // Yoochat app frontend
  "http://localhost:3002", // admin panel frontend
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // server requests
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true,
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const routes = require("./routes/routes");
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("YoChat API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
