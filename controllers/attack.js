/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */
/* eslint-disable new-cap */
const router = require('express').Router();
const verify = require('../middleware/tokenVerification');
const Team = require('../models/Team');

router.post('/attack', verify, async (req, res) => {
  let totalAttack =
    req.body.soldier * 150 + req.body.aircraft * 300 + req.body.tank * 500;
  if (req.team.multiplier === true) {
    totalAttack *= 1.5;
  }
  const defender = await Team.findOne({name: req.body.defender});
  if (
    defender.defenseCooldown !== 0 ||
    req.team.attackCooldown !== 0 ||
    defender.shield === true
  ) {
    res.redirect('/leaderboard/?success=no');
  }
  //* Success
  if (totalAttack - defender.dp >= 50) {
    Team.updateOne(
        {email: defender.email},
        {
          $set: {
            dp: defender.dp - totalAttack,
            fp: parseInt(defender.fp / 2),
            defenseCooldown: 60,
          },
        },
        {multi: true},
        callback,
    );
    function callback(err, num) {
      if (err) {
        console.log(err);
      }
    }
    Team.updateOne(
        {email: req.team.email},
        {
          $inc: {
            'troops.soldiers': -req.body.soldier,
            'troops.aircrafts': -req.body.aircraft,
            'troops.tanks': -req.body.tank,
            'fp': parseInt(defender.fp / 2),
            'attackCooldown': 60,
          },
        },
        {multi: true},
        attackcallback,
    );
    function attackcallback(err, _num) {
      if (err) {
        console.log(err);
      }
    }
    res.redirect('/leaderboard/?success=true');
  } else {
    // !Failure
    Team.updateOne(
        {email: req.team.email},
        {
          $inc: {'troops.soldiers': -req.body.soldier},
          $set: {attackCooldown: 30},
        },
        {multi: true},
        attackcallback,
    );
    function attackcallback(err, num) {
      if (err) {
        console.log(err);
      }
    }
    Team.updateOne(
        {email: defender.email},
        {
          $set: {defenseCooldown: 60},
        },
        {multi: true},
        callback,
    );
    function callback(err, num) {
      if (err) {
        console.log(err);
      }
    }
    res.redirect('/leaderboard/?success=false');
  }
});

module.exports = router;
