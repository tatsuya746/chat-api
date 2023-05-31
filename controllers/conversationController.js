const Conversation = require("../models/Conversation");

function generateConversationId() {
  const min = 1000000000000000000; // smallest 19-digit number
  const max = 9999999999999999999; // largest 19-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createNewConversation = async (req, res) => {
  try {
    const newConversation = await new Conversation({
      conversationId: generateConversationId(),
      users: [req.body.userA, req.body.userB],
    });

    //Save new conversation to DB
    const conversation = await newConversation.save();
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find().populate(
      "members",
      "username usernameCode avatar"
    );
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getConversationByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    const conversations = await Conversation.find({
      sender: userId,
    }).populate('recipient', 'username usernameCode avatar');
    if (!conversations) {
      res.status(404).json("No conversations found for user");
    }
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getConversationByConversationId = async (req, res) => {
  try {
    const { conversationId, userId } = req.query;
    const conversation = await Conversation.find({
      conversationId: conversationId,
      sender: userId,
    }).populate('sender recipient', '_id username usernameCode avatar')
    if (conversation.length > 0) {
      return res.status(200).json(conversation);
    }
    return res.status(404).json("No conversation found for user");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createNewConversation,
  getAllConversation,
  getConversationByUserId,
  getConversationByConversationId,
  generateConversationId,
};
