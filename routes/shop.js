const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const contentSecurity = require("../middleware/contentSecurity");

router.get("/shop", contentSecurity, verify, (req, res) => {
  var error = req.query.error;
  res.render("shop.ejs", {
    team: req.team,
    error: error,
    active: "shop",
  });
});

module.exports = router;
