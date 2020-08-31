const router = require("express").Router();
const verifynCrypt = require("../middleware/ncryptVerification");
const jwt = require("jsonwebtoken");

router.get("/logincrypt", (req, res) => {
  res.render("logincrypt.ejs");
});

router.post("/logincrypt", async (req, res) => {
  if (
    req.body.email === process.env.ADMIN &&
    req.body.password === process.env.PASS
  ) {
    const token = jwt.sign({ user: "ncrypt" }, process.env.nJWT);
    res.cookie("ncrypt", token, { httpOnly: true });
    res.redirect("/questionMaker");
  }
});

router.get("/nlogout", verifynCrypt, (req, res) => {
  res.cookie("ncrypt", "", { maxAge: 1 });
  res.redirect("/");
});

module.exports = router;
