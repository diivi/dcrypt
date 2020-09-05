const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");

router.post("/attack", verify, async (req, res) => {
  const totalAttack =
    req.body.soldier * 150 + req.body.aircraft * 300 + req.body.tank * 500;
  const defender = await Team.findOne({ name: req.body.defender });
  //*Success
  if (totalAttack - defender.dp >= 50) {
    Team.updateOne(
      { email: defender.email },
      {
        $set: { dp: defender.dp - totalAttack, fp: parseInt(defender.fp / 2) },
      },
      { multi: true },
      callback
    );
    function callback(err, num) {
      if (err) {
        console.log(err);
      }
    }
    Team.updateOne(
      { email: req.team.email },
      {
        $inc: {
          "troops.soldiers": -req.body.soldier,
          fp: parseInt(defender.fp / 2),
        },
      },
      { multi: true },
      attackcallback
    );
    function attackcallback(err, num) {
      if (err) {
        console.log(err);
      }
    }
    res.redirect("/dashboard/?success=true");
  } else {
    //!Failure
    Team.updateOne(
      { email: req.team.email },
      { $inc: { "troops.soldiers": -req.body.soldier } },
      { multi: true },
      attackcallback
    );
    function attackcallback(err, num) {
      if (err) {
        console.log(err);
      }
    }
    Team.updateOne(
      { school: defender.school },
      {
        $set: { dp: defender.dp - totalAttack },
      },
      { multi: true },
      callback
    );
    function callback(err, num) {
      if (err) {
        console.log(err);
      }
    }
    res.redirect("/dashboard/?success=false");
  }
});

module.exports = router;
