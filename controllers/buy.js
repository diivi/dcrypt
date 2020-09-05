const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");

router.post("/buy", verify, async (req, res) => {
  const totalCost =
    req.body.soldier * 100 +
    req.body.aircraft * 250 +
    req.body.bomber * 250 +
    req.body.tank * 400;
  const buyer = await Team.findOne({ email: req.team.email });
  if (
    req.body.soldier == 0 &&
    req.body.aircraft == 0 &&
    req.body.bomber == 0 &&
    req.body.tank == 0
  ) {
    res.redirect("/shop/?error=buyless");
  }
  if (buyer.bp >= totalCost) {
    Team.updateOne(
      { email: req.team.email },
      {
        $inc: {
          "troops.soldiers": req.body.soldier,
          "troops.aircrafts": req.body.aircraft,
          "troops.bombers": req.body.bomber,
          "troops.tanks": req.body.tank,
          bp: -totalCost,
        },
      },
      { multi: true },
      buycallback
    );
    function buycallback(err, num) {
      if (err) {
        console.log(err);
      }
    }
    res.redirect("/dashboard");
  } else {
    res.redirect("/shop/?error=buywrong");
  }
});

module.exports = router;
