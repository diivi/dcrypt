const router = require("express").Router();
const Team = require("../models/Team");
const verify = require("../middleware/tokenVerification");
const validateTeam = require("../middleware/teamValidate");
const loginValidate = require("../middleware/loginValidate");
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
  console.log(recap);
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
  });
  try {
    const registered = await team.save();
    res.render("register.ejs", { registered: true });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const team = await Team.findOne({ email: req.body.email });
  if (!team) return res.status(400).send("Team not registered");

  const passCheck = await bcrypt.compare(req.body.password, team.password);
  if (!passCheck) return res.status(400).send("Invalid Password");

  const token = jwt.sign({ _id: team._id }, process.env.JWT);
  res.cookie("team", token, { httpOnly: true });
  res.redirect("/dashboard");
});

router.get("/logout", verify, (req, res) => {
  res.cookie("team", "", { maxAge: 1 });
  res.redirect("/");
});

module.exports = router;
