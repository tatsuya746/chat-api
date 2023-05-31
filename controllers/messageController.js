const Message = require("../models/Message");
const cloudinary = require("../utils/cloudinary");

// Define a function to upload a single file to Cloudinary
const uploadFile = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath);
  return result;
};

//Sending message
const createNewMessage = async (req, res) => {
  try {
    console.log(req.file);
    const imagesArr = [];
    const imagesUrlArr = [];
    // Add the paths of the uploaded images to the images array
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        imagesArr.push(file.path);
      });
    }

    // Upload all files one by one using a loop
    for (let i = 0; i < imagesArr.length; i++) {
      const result = await cloudinary.uploader.upload(imagesArr[i]);
      console.log("Upload result:", result);
      imagesUrlArr.push(result.url);
    }

    const newMessage = await new Message({
      conversationId: req.body.conversationId,
      senderId: req.body.senderId,
      recipientId: req.body.recipientId,
      message: req.body.message,
      images: imagesUrlArr,
    }).populate("senderId", "id username usernameCode avatar");

    // Save new message to DB
    const message = await newMessage.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
};


const getAllMessages = async (req, res) => {
  try {
    const { userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const perPage = 50;

    // Get the total number of messages
    const totalMessages = await Message.countDocuments();

    const messages = await Message.find({
      conversationId: req.params.id,
      $or: [{ senderId: userId }, { recipientId: userId }]
    })
      .populate("senderId", "id username usernameCode avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (messages.length === 0) {
      res.status(404).json("Not found conversation");
      return;
    }
    res.status(200).json({
      messages,
      pagination: {
        page,
        perPage,
        totalPages: Math.ceil(totalMessages / perPage),
        totalMessages,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteMessageById = async (req, res) => {
  const { messageId } = req.query;
  try {
    const user = await Message.findOne({ _id: messageId });
    user.remove();
    res.status(200).json("Success delete user");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createNewMessage,
  getAllMessages,
  deleteMessageById,
};
