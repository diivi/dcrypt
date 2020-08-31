const router = require("express").Router();
const verify = require("../middleware/tokenVerification");

router.get("/dashboard", verify, (req, res) => {
  var success = req.query.success;
  res.render("dash.ejs", { team: req.team, success: success });
});

module.exports = router;
