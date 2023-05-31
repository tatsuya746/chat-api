const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      require: true,
    },
    senderId: {
      type: String,
      ref: "User",
      require: true,
    },
    recipientId: {
      type: String,
      ref: "User",
      require: true,
    },
    message: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
