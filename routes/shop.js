const router = require("express").Router();
const verify = require("../middleware/tokenVerification");

router.get("/shop", verify, (req, res) => {
  var error = req.query.error;
  res.render("shop.ejs", {
    team: req.team,
    error: error,
    active: "shop",
  });
});

module.exports = router;
