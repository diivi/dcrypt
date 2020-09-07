const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");

router.post("/attack", verify, async (req, res) => {
  var totalAttack =
    req.body.soldier * 150 + req.body.aircraft * 300 + req.body.tank * 500;
  if (req.team.multiplier === true) {
    totalAttack *= 1.5;
  }
  const defender = await Team.findOne({ name: req.body.defender });
  //*Success
  if (totalAttack - defender.dp >= 50) {
    Team.updateOne(
      { email: defender.email },
      {
        $set: {
          dp: defender.dp - totalAttack,
          fp: parseInt(defender.fp / 2),
          defenseCooldown: 60,
        },  
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
          "troops.aircrafts": -req.body.aircraft,
          "troops.tanks": -req.body.tank,
          fp: parseInt(defender.fp / 2),
          attackCooldown: 60,
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
      {
        $inc: { "troops.soldiers": -req.body.soldier },
        $set: { attackCooldown: 30 },
      },
      { multi: true },
      attackcallback
    );
    function attackcallback(err, num) {
      if (err) {
        console.log(err);
      }
    }
    Team.updateOne(
      { email: defender.email },
      {
        $set: { dp: defender.dp - totalAttack, defenseCooldown: 60 },
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
