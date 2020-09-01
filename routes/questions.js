const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Questions = require("../models/Questions");
const Team = require("../models/Team");

router.get("/questions", verify, (req, res) => {
  Questions.find({})
    .sort({ qnum: "asc" })
    .exec(function (err, docs) {
      if (err) {
        console.log(err);
      }
      res.render("questions.ejs", { team: req.team, questions: docs });
    });
});
router.post("/answer", verify, async (req, res) => {
  const question = await Questions.findOne({
    answer: req.body.ans,
    title: req.body.title,
  }).catch((err) => {
    console.log(err);
  });
  if (!question) {
    res.redirect("/questions");
    console.log("wrogn");
  } else if (question) {
    Team.updateOne(
      { _id: req.team._id },
      { $push: { questions: question.title } },
      { multi: true },
      answercallback
    );
    Team.updateOne(
      { school: req.team.school },
      { $inc: { fp: question.points } },
      { multi: true },
      pointscallback
    );
    function answercallback(err, num) {
      if (err) {
        console.log(err);
      }
    }
    function pointscallback(err, num) {
      if (err) {
        console.log(err);
      }
    }
    res.redirect("/questions");
  }
});
//TODO: Points add
module.exports = router;
