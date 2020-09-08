const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Questions = require("../models/Questions");


router.get("/questions", verify, (req, res) => {
  Questions.find({})
    .sort({ qnum: "asc" })
    .exec(function (err, docs) {
      if (err) {
        console.log(err);
      }
      res.render("questions.ejs", {
        team: req.team,
        curr: req.query.question,
        questions: docs,
        active: "questions",
      });
    });
});

module.exports = router;
