const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const dashRoute = require("./routes/dashboard");
const port = 5000 || process.env.PORT;

require("dotenv").config();

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to db");
  }
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.json());

app.use("/api/team", authRoute);
app.use("/api/dashboard", dashRoute);

app.get("/", (req, res) => {
  res.render("index.html", { message: "hello " });
});

app.listen(port, () => console.log(`running on port ${port}`));
