const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const contentSecurity = require("../middleware/contentSecurity");

router.get("/dashboard", contentSecurity, verify, (req, res) => {
  var success = req.query.success;
  res.render("dash.ejs", {
    team: req.team,
    success: success,
    active: "dashboard",
  });
});

module.exports = router;
