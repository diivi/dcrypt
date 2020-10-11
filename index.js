/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const helmet = require("helmet");

const powerupManager = require("./jobs/powerups");
powerupManager.start();
const cooldownManager = require("./jobs/cooldown");
cooldownManager.start();

const authRoute = require("./routes/auth");
const dashRoute = require("./routes/dashboard");
const boardRoute = require("./routes/leaderboard");
const admin = require("./routes/admin");
const questionRoute = require("./routes/questions");
const shopRoute = require("./routes/shop");

const attackRoute = require("./controllers/attack");
const makerRoute = require("./controllers/questionMaker");
const buyRoute = require("./controllers/buy");
const defRoute = require("./controllers/defense");
const ansRoute = require("./controllers/answer");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const Team = require("./models/Team");

const port = 5000 || process.env.PORT;
require("dotenv").config();

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
    console.log("connected to db");
  }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use("/", ansRoute);

app.use("/", authRoute);
app.use("/", dashRoute);
app.use("/", boardRoute);
app.use("/", attackRoute);
app.use("/", makerRoute);
app.use("/", admin);
app.use("/", questionRoute);
app.use("/", shopRoute);
app.use("/", buyRoute);
app.use("/", defRoute);

app.get("/", (req, res) => {
  res.render("index.ejs", { active: "home" });
});

app.get("/register", (req, res) => {
  res.render("register.ejs", { active: "register" });
});

app.get("/login", (req, res) => {
  res.render("login.ejs", { active: "login" });
});

app.get("*", function (req, res) {
  res.status(404).render("404.ejs");
});

app.listen(port, () => console.log(`running on port ${port}`));
