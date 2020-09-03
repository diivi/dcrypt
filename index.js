const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
// var cron = require("node-cron");
var helmet = require("helmet");

const authRoute = require("./routes/auth");
const dashRoute = require("./routes/dashboard");
const boardRoute = require("./routes/leaderboard");
const admin = require("./routes/admin");
const questionRoute = require("./routes/questions");

const attackRoute = require("./controllers/attack");
const makerRoute = require("./controllers/questionMaker");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const port = 5000 || process.env.PORT;
const Team = require("./models/Team");

require("dotenv").config();

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log("connected to db");
  }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", authRoute);
app.use("/", dashRoute);
app.use("/", boardRoute);
app.use("/", attackRoute);
app.use("/", makerRoute);
app.use("/", admin);
app.use("/", questionRoute);

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://* 'unsafe-inline'"
  );
  return next();
});

app.get("/", (req, res) => {
  res.render("index.ejs", { active: "home" });
});

app.get("/register", (req, res) => {
  res.render("register.ejs", { active: "register" });
});

app.get("/login", (req, res) => {
  res.render("login.ejs", { active: "login" });
});

// fpIncrease = cron.schedule(
//   "0 * * * *",
//   () => {
//     Team.updateMany({}, { $inc: { fp: 100 } }, { multi: true }, inccallback);
//     function inccallback(err, num) {
//       if (err) {
//         console.log(err);
//       }
//     }
//   },
//   {
//     scheduled: true,
//     timezone: "Asia/Kolkata",
//   }
// );
// fpIncrease.start();

app.listen(port, () => console.log(`running on port ${port}`));
