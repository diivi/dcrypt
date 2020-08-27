const router = require("express").Router();
const verify = require("../middleware/tokenVerification");

router.get("/", verify, (req, res) => {
  res.send(req.team);
});

module.exports = router;
