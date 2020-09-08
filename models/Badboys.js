const mongoose = require("mongoose");

const badSchema = new mongoose.Schema({
  team: {
    type: "String",
  },
  time: {
    type: "Date",
    default: new Date(),
  },
});

module.exports = mongoose.model("Blacklist", badSchema);
