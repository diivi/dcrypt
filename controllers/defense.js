const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");

router.post("/defense", verify, async (req, res) => {
  if (req.body.soldier < 0 && req.body.bomber < 0 && req.body.tank < 0) {
    res.send("no");
  } else if (
    req.body.soldier == 0 &&
    req.body.bomber == 0 &&
    req.body.tank == 0
  ) {
    res.redirect("/dashboard/?success=allot");
  } else {
    if (
      req.team.troops.soldiers >= req.body.soldier &&
      req.team.troops.tanks >= req.body.tank &&
      req.team.troops.bombers >= req.body.bomber
    ) {
      const totalDef =
        req.body.soldier * 100 + req.body.bomber * 300 + req.body.tank * 500;
      Team.updateOne(
        { email: req.team.email },
        {
          $inc: {
            "troops.soldiers": -req.body.soldier,
            "troops.bombers": -req.body.bomber,
            "troops.tanks": -req.body.tank,
            dp: totalDef,
          },
        },
        { multi: true },
        defcallback
      );
      function defcallback(err, num) {
        if (err) {
          console.log(err);
        }
      }
      res.redirect("/dashboard");
    } else {
      res.send("no");
    }
  }
});
module.exports = router;
