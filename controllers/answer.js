const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const Team = require("../models/Team");
const Log = require("../models/Log");
const Questions = require("../models/Questions");
var RateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
var MongoStore = require("rate-limit-mongo");
const Badboy = require("../models/Badboys");

require("dotenv").config();
var queslimiter = new RateLimit({
  store: new MongoStore({
    uri: process.env.MONGO_URI,
    expireTimeMs: 60 * 1000 * 60,
    collectionName: "ansForce",
  }),
  max: 150,
  windowMs:10 * 60 * 1000,
  message: "Too many requests in a short duration, IP Banned for an hour.",
  onLimitReached: async function (req, res) {
    try {
      const badboy = new Badboy({
        team: req.cookies.team,
      });
      try {
        const bad = await badboy.save();
      } catch (e) {
        console.log(e);
      }
    } catch (e) {}
  },
});

router.post("/answer/", verify, queslimiter, async (req, res) => {
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

module.exports = router;
