const mongoose = require("mongoose");



const questionSchema = new mongoose.Schema({
  qnum: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Question", questionSchema);
