const jwt = require("jsonwebtoken");
const Team = require("../models/Team");

module.exports = async function (req, res, next) {
  const token = req.cookies.team;
  if (!token) return res.redirect("/login");
  try {
    const verified = jwt.verify(token, process.env.JWT);
    req.team = await Team.findOne({ _id: verified._id });
    next();
  } catch (err) {
    res.redirect("/login");
  }
};
