const router = require("express").Router();
const Team = require("../models/Team");
const verify = require("../middleware/tokenVerification");
const validateTeam = require("../middleware/teamValidate");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const contentSecurity = require("../middleware/contentSecurity");
const axios = require("axios");
var original = {};

router.post("/register", contentSecurity, async (req, res) => {
  var { error } = validateTeam(req.body);
  if (error) {
    original = error._original;
    errors = [];
    for (errorName of error.details) {
      errors.push(errorName.path[0]);
    }
    return res.render("register.ejs", {
      errors: errors,
      original: original,
    });
  } else {
    original = {
      email: req.body.email,
      password: req.body.password,
      school: req.body.school,
      discord: req.body.discord,
      name: req.body.name,
    };
  }
  response = await axios({
    method: "post",
    url: "https://www.google.com/recaptcha/api/siteverify",
    params: {
      secret: "6LefzcYZAAAAAOpTOSNQ8-JoBwfMeadgHgJt8F-O",
      response: req.body["g-recaptcha-response"],
    },
  });
  var recap = response.data.success;
  if (!recap) {
    return res.render("register.ejs", {
      galatRecaptcha: true,
      original: original,
    });
  }
  const teamRegistered = await Team.findOne({ email: req.body.email });
  if (teamRegistered) return res.render("register.ejs", { alregistered: true });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  const team = new Team({
    school: req.body.school,
    email: req.body.email,
    password: hashed,
    discord: req.body.discord,
    name: req.body.name,
  });
  try {
    const registered = await team.save();
    res.render("register.ejs", { registered: true });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", contentSecurity, async (req, res) => {
  const team = await Team.findOne({ email: req.body.email });
  if (!team) return res.render("login.ejs", { failure: true, active: "login" });

  const passCheck = await bcrypt.compare(req.body.password, team.password);
  if (!passCheck)
    return res.render("login.ejs", { failure: true, active: "login" });

  const token = jwt.sign({ _id: team._id }, process.env.JWT);
  res.cookie("team", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  });
  res.redirect("/dashboard");
});

router.post("/passchange", contentSecurity, async (req, res) => {
  const team = await Team.findOne({ email: req.body.email });
  if (!team) return res.render("login.ejs", { failure: true, active: "login" });

  const passCheck = await bcrypt.compare(req.body.old, team.password);
  if (!passCheck)
    return res.render("login.ejs", { failure: true, active: "login" });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.new, salt);

  Team.updateOne(
    { email: req.body.email },
    { $set: { password: hashed } },
    { multi: true },
    passcallback
  );
  function passcallback(err, num) {
    if (err) {
      console.log(err);
    } else {
      return res.render("login.ejs", { passed: true, active: "login" });
    }
  }
});

router.get("/logout", verify, (req, res) => {
  res.cookie("team", "", { maxAge: 1 });
  res.redirect("/");
});

module.exports = router;
