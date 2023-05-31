const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  email: {
    type: String,
    ref: "User",
    require: true,
    unique: true,
  },
  token: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

module.exports = mongoose.model("token", tokenSchema);
