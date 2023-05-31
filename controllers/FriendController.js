const FriendRequest = require("../models/FriendRequest");
const Friend = require("../models/Friend");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

const generateConversationId = () => {
  const randomNumber =
    Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000;
  return randomNumber.toString();
};

//Create a Friend Request from user
const createFriendRequest = async (req, res) => {
  try {
    const { senderId, recipientName } = req.body;
    const [username, usernameCode] = recipientName.split("#");
    const recipient = await User.findOne({
      username: username,
      usernameCode: usernameCode,
    });

    // Check if recipient user exists
    if (!recipient) {
      res
        .status(404)
        .json(
          "Hm, didn't work. Double check that the capitalization, spelling, any spaces, and numbers are correct"
        );
      return;
    }
    const recipientId = recipient._id.toString();

    // Check if sender is sending a friend request to themselves
    if (senderId === recipientId) {
      res.status(400).json("Cannot send friend request to yourself");
      return;
    }

    // Check if a friend request has already been sent by the sender
    const existingFriendRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
    });
    if (existingFriendRequest) {
      res
        .status(400)
        .json(`You've already sent friend request to ${recipientName}`);
      return;
    }

    //Check if 2 users already firend
    const existingFriendship = await Conversation.findOne({
      $or: [
        { sender: senderId, recipient: recipientId, status: "Friend" },
        { sender: recipientId, recipient: senderId, status: "Friend" },
      ],
    });
    if (existingFriendship) {
      res.status(400).json("You're already friends with that user!");
      return;
    }

    const newFriendRequest = new FriendRequest({
      sender: senderId.toString(),
      recipient: recipientId.toString(),
    });
    await newFriendRequest.populate(
      "sender recipient",
      "username usernameCode avatar"
    );

    const friendReqest = await newFriendRequest.save();
    res.status(200).json({
      message: `Success! Your friend request to ${recipientName} was sent.`,
      friendRequest: friendReqest,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//Get all friend requests for a user
const getAllFriendRequests = async (req, res) => {
  try {
    const { userId } = req.query;
    //const recipient = {username: username, usernameCode: usernameCode};
    const friendRequests = await FriendRequest.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate({
        path: "sender",
        select: "username usernameCode avatar",
        model: "User",
      })
      .populate({
        path: "recipient",
        select: "username usernameCode avatar",
        model: "User",
      });

    res.status(200).json(friendRequests);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Accept Friend Request by recipient
const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json("Friend request not found");
    }

    const { sender, recipient } = request;

    const conversation = await Conversation.findOne({
      sender: sender.toString(),
      recipient: recipient.toString(),
    });

    const conversationId = generateConversationId();

    if (!conversation) {
      const conversationForSender = new Conversation({
        conversationId: conversationId,
        sender: sender.toString(),
        recipient: recipient.toString(),
        status: "Friend",
      });

      const conversationForRecipient = new Conversation({
        conversationId: conversationId,
        sender: recipient.toString(),
        recipient: sender.toString(),
        status: "Friend",
      });

      //Create New Conversation between two friends
      const senderConversation = await conversationForSender.save();
      const recipientConversation = await conversationForRecipient.save();
      await senderConversation.populate(
        "recipient",
        "_id username usernameCode avatar"
      );
      await recipientConversation.populate(
        "recipient",
        "_id username usernameCode avatar"
      );
      res.status(200).json({
        sender: senderConversation,
        recipient: recipientConversation,
      });
    }

    //Remove Friend Request
    await request.remove();
  } catch (error) {
    res.status(500).json(error);
  }
};

//Reject Friend Request by recipient
const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json("Friend request not found");
    }
    await request.remove();
    res.status(200).json(requestId);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Get all friend of user
const getAllFriendsByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    // Get the total number of users
    const totalFriends = await Friend.find({ userId: userId })
      .populate({
        path: "userId",
        select: "username usernameCode avatar",
        model: "User",
      })
      .populate({
        path: "friendId",
        select: "username usernameCode avatar",
        model: "User",
      });

    res.status(200).json(totalFriends);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createFriendRequest,
  getAllFriendRequests,
  acceptRequest,
  rejectRequest,
  getAllFriendsByUserId,
};
