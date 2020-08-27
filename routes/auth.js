const router = require("express").Router();
const Team = require("../models/Team");
const validateTeam = require("../middleware/teamValidate");
const loginValidate = require("../middleware/loginValidate");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { error } = validateTeam(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const teamRegistered = await Team.findOne({ email: req.body.email });
  if (teamRegistered) return res.status(400).send("Team already registered!");

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);

  const team = new Team({
    name: req.body.name,
    email: req.body.email,
    password: hashed,
  });
  try {
    const registered = await team.save();
    res.send(registered);
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
  res.header("auth-token", token).send(token);
});

module.exports = router;
