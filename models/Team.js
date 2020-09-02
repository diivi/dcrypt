const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  school: {
    type: String,
    required: true,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  discord: {
    type: String,
    required: true,
    lowercase: true,
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
  fp: {
    type: Number,
    default: 0,
    min: 0,
  },
  bp: {
    type: Number,
    default: 0,
    min: 0,
  },
  dp: {
    type: Number,
    default: 0,
    min: 0,
  },
  questions: [
    {
      type: String,
    },
  ],
  troops: {
    soldiers: {
      type: Number,
      default: 0,
    },
    aircrafts: {
      type: Number,
      default: 0,
    },
    bombers: {
      type: Number,
      default: 0,
    },
    tanks: {
      type: Number,
      default: 0,
    },
  },
  dpVisible: {
    type: Boolean,
    default: false,
  },
});

teamSchema.pre("updateOne", function (next) {
  data = this.getUpdate();
  try {
    if (data["$set"].dp > 0) {
      next();
    } else {
      data["$set"].dp = 0;
      next();
    }
  } catch {
    next();
  }
});

module.exports = mongoose.model("Team", teamSchema);
