const router = require("express").Router();
const verify = require("../middleware/tokenVerification");
const verifynCrypt = require("../middleware/ncryptVerification");
const Question = require("../models/Questions");

router.get("/questionMaker", verify, (req, res) => {
  res.render("makeQuestion.ejs");
});
router.post("/questionMaker", verifynCrypt, async (req, res) => {
  const question = new Question({
    qnum: req.body.qnum,
    question: req.body.ques,
    answer: req.body.ans,
    points: req.body.points,
    title: req.body.title
  });
  try {
    const made = await question.save();
    console.log(made);
    res.render("makeQuestion.ejs", { registered: true });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
