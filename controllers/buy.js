const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");

router.post("/buy", verify, async (req, res) => {
  var totalCost =
    req.body.soldier * 100 +
    req.body.aircraft * 250 +
    req.body.bomber * 250 +
    req.body.tank * 400;
  var buyer = await Team.findOne({ email: req.team.email });
  if (buyer.discountsLeft === 1) {
    Team.updateOne(
      { email: req.team.email },
      {
        $set: {
          halfPrice: false,
        },
      },
      { multi: true },
      yarbhaicallback
    );
    function yarbhaicallback(err, num) {
      if (err) {
        console.log(err);
      }
    }
  }
  if (buyer.discountsLeft > 0) {
    totalCost *= 1 / 2;
    Team.updateOne(
      { email: req.team.email },
      {
        $inc: {
          discountsLeft: -1,
        },
      },
      { multi: true },
      ekaurcallback
    );
    function ekaurcallback(err, num) {
      if (err) {
        console.log(err);
      }
    }
  }
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

router.post("/powerup", verify, async (req, res) => {
  const totalCost =
    req.body.multiplier * 1000 +
    req.body.shield * 1000 +
    req.body.half * 1000 +
    req.body.dp * 1000;
  const buyer = await Team.findOne({ email: req.team.email });
  if (buyer.discountsLeft === 0) {
    Team.updateOne(
      { email: req.team.email },
      {
        $set: {
          halfPrice: false,
        },
      },
      { multi: true },
      powerupcallback
    );
  }
  if (buyer.discountsLeft > 0) {
    totalCost *= 1 / 2;
    Team.updateOne(
      { email: req.team.email },
      {
        $inc: {
          discountsLeft: -1,
        },
      },
      { multi: true },
      powerupcallback
    );
  }
  if (
    req.body.multiplier == 0 &&
    req.body.shield == 0 &&
    req.body.half == 0 &&
    req.body.dp == 0
  ) {
    res.redirect("/shop/?error=buyless");
  }
  if (
    buyer.shield === true ||
    buyer.halfPrice === true ||
    buyer.dpVisible === true ||
    buyer.multiplier === true
  ) {
    res.redirect("/shop/?error=powerup");
  } else if (buyer.bp >= totalCost) {
    const setter = [
      req.body.dp === "1" ? true : false,
      req.body.shield === "1" ? true : false,
      req.body.multiplier === "1" ? true : false,
      req.body.half === "1" ? true : false,
    ];
    if (setter.filter((v) => v).length > 1) {
      res.redirect("/shop/?error=powerup");
    } else {
      let currentPowerup = setter.indexOf(true);
      Team.updateOne(
        { email: req.team.email },
        {
          $set: {
            dpVisible: setter[0],
            shield: setter[1],
            multiplier: setter[2],
            halfPrice: setter[3],
            powerupTimer: currentPowerup !== 3 ? 60 : 0,
            discountsLeft: currentPowerup === 3 ? 3 : 0,
          },
          $inc: {
            bp: -totalCost,
          },
        },
        { multi: true },
        powerupcallback
      );
      function powerupcallback(err, num) {
        if (err) {
          console.log(err);
        }
      }
      res.redirect("/dashboard");
    }
  } else {
    res.redirect("/shop/?error=buywrong");
  }
});

module.exports = router;
//todo:dashboard;max 10 items add karo per shopitem to price
