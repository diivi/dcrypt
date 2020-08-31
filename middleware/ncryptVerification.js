const jwt = require("jsonwebtoken");
const Team = require("../models/Team");

module.exports = async function (req, res, next) {
  const token = req.cookies.ncrypt;
  if (!token) return res.redirect("/login");
  try {
    const verified = jwt.verify(token, process.env.nJWT);
    next();
  } catch (err) {
    res.redirect("/login");
  }
};
