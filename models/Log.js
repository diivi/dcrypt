const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  qtitle: {
    type: String,
    required: true,
  },
  sol: {
    type: String,
    required: true,
  },
  solver: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    default: Date().toLocaleString(),
  },
  success: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Log", logSchema);
