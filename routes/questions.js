const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Questions = require("../models/Questions");
const Team = require("../models/Team");
const Log = require("../models/Log");
var RateLimit = require("express-rate-limit");
var MongoStore = require("rate-limit-mongo");

router.get("/questions",  verify, (req, res) => {
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

var limiter = new RateLimit({
  store: new MongoStore({
    uri: process.env.MONGO_URI,
    expireTimeMs: 60 * 1000 * 60,
    collection: 'expressRateRecords',
  }),
  max: 20,
  windowMs: 60 * 1000,
  message: "Too many requests in a short duration, IP Banned for an hour.",
});

router.post("/answer", limiter , verify, async (req, res) => {
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
