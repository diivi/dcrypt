const router = require("express").Router();
const verify = require("../middleware/tokenVerification");

router.get("/dashboard", verify, (req, res) => {
  var success = req.query.success;
  var active = req.query.active;
  res.render("dash.ejs", { team: req.team, success: success,active:'dashboard' });
});

module.exports = router;
