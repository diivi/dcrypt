const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const contentSecurity = require("../middleware/contentSecurity");
const Team = require("../models/Team");

router.get("/leaderboard", contentSecurity, verify, (req, res) => {
  var success = req.query.success;
  Team.find({})
    .sort({ fp: "desc" })
    .exec(function (err, docs) {
      if (err) {
        console.log(err);
      }
      res.render("leaderboard.ejs", {
        team: req.team,
        allteams: docs,
        active: "leaderboard",
        success: success,
      });
    });
});

router.get("/leaderboardout", contentSecurity, (req, res) => {
  Team.find({})
    .sort({ fp: "desc" })
    .exec(function (err, docs) {
      if (err) {
        console.log(err);
      }
      res.render("leaders.ejs", { active: "leaderboard", allteams: docs });
    });
});

module.exports = router;
