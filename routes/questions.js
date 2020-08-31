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
    res.status(401).send("wrogn");
  }
  console.log(question);
});
//TODO:Answers Verify + Points add + list of strings in user modal
module.exports = router;
