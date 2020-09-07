const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Questions = require("../models/Questions");
const Team = require("../models/Team");
const Log = require("../models/Log");
const contentSecurity = require("../middleware/contentSecurity");

router.get("/questions", contentSecurity, verify, (req, res) => {
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
router.post("/answer", verify, async (req, res) => {
  const activity = new Log({
    qtitle: req.body.title,
    sol: req.body.ans,
    solver: req.team.email,
  });
  try {
    const logged = await activity.save();
  } catch (error) {
    res.send(error);
  }
  const question = await Questions.findOne({
    answer: req.body.ans,
    title: req.body.title,
  }).catch((err) => {
    console.log(err);
  });
  if (!question) {
    res.redirect("/questions/?question=" + req.body.title);
  } else if (question) {
    const activity = new Log({
      qtitle: question.title,
      sol: req.body.ans,
      solver: req.team.email,
      success: true,
    });
    try {
      const logged = await activity.save();
    } catch (error) {
      res.send(error);
    }
    Team.updateOne(
      { _id: req.team._id },
      {
        $push: { questions: question.title },
        $inc: { bp: question.points, fp: 500 },
      },
      { multi: true },
      answercallback
    );
    function answercallback(err, num) {
      if (err) {
        console.log(err);
      }
    }

    res.redirect("/questions");
  }
});
//TODO: Points add
module.exports = router;
