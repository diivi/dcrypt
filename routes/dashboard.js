const router = require("express").Router();
const verify = require("../middleware/tokenVerification");

router.get("/dashboard", verify, (req, res) => {
  res.render('dash.ejs', {team:req.team})
});


module.exports = router;
