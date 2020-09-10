/* eslint-disable linebreak-style */
// eslint-disable-next-line new-cap
const router = require('express').Router();
const verify = require('../middleware/tokenVerification');
const Team = require('../models/Team');

router.get('/leaderboard', verify, (req, res) => {
  const success = req.query.success;
  Team.find({})
      .sort({fp: 'desc'})
      .exec(function(err, docs) {
        if (err) {
          console.log(err);
        }
        res.render('leaderboard.ejs', {
          team: req.team,
          allteams: docs,
          active: 'leaderboard',
          success: success,
        });
      });
});

router.get('/leaderboardout', (req, res) => {
  Team.find({})
      .sort({fp: 'desc'})
      .exec(function(err, docs) {
        if (err) {
          console.log(err);
        }
        res.render('leaders.ejs', {active: 'leaderboard', allteams: docs});
      });
});

module.exports = router;
