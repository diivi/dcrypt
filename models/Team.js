const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    min: 5,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Team", teamSchema);
