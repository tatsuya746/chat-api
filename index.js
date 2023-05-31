const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const friendRoute = require("./routes/friend");
const Conversation = require("./models/Conversation");

dotenv.config();
const app = express();
const http = require("http").Server(app);

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

//ROUTES
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/conversation", conversationRoute);
app.use("/api/message", messageRoute);
app.use("/api/friend", friendRoute);

mongoose.connect(process.env.DATABASE_URL, { useNewurlParser: true }, () => {
  console.log("Connected to Mongodb");
});

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// Listen for incoming connections
io.on("connection", (socket) => {
  console.log(`New client connected ${socket.id}`);

  // Handle when a user sends a message
  socket.on("send message", (message) => {
    console.log("message received", message);

    // Send the message to all other users in the same room
    socket.to(message.conversationId).emit("receive message", message);
  });

  // Handle when a user joins a room chat
  socket.on("join room", (roomId) => {
    socket.join(roomId);
    console.log(`user join ${roomId}`);
  });

  // Handle when a user access to app to receive request
  socket.on("join app", (userId) => {
    socket.join(userId);
    console.log(`user join app ${userId}`);
  });

  // Handle friend request sent by sender
  socket.on("friend request sent", (friendRequest) => {
    try {
      // Emit the friend request to the recipient
      console.log("receive friend request", friendRequest);
      socket
        .to(friendRequest.recipient._id)
        .emit("friend request received", friendRequest);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("remove request", (friendRequest) => {
    try {
      console.log("request received", friendRequest);

      // Send the message to all other users in the same room
      socket
        .to(friendRequest.recipient._id)
        .emit("request responsed", friendRequest);
      socket
        .to(friendRequest.sender._id)
        .emit("request responsed", friendRequest);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("receive conversations", (conversations) => {
    try {
      console.log("conversations received", conversations);

      const { sender, recipient } = conversations;
      console.log(sender, recipient);

      // Send the message to all other users in the same room
      socket.to(sender.sender).emit("conversation responsed", sender);
      socket.to(recipient.sender).emit("conversation responsed", recipient);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("update profile", async (newProfile) => {
    try {
      console.log(newProfile);
      const conversationList = await Conversation.find({
        sender: newProfile._id,
      }).populate("recipient", "username usernameCode avatar");

      conversationList.forEach((conversation) => {
        socket.to(conversation.recipient._id.toString()).emit("profile updated", newProfile);
      });
    } catch (error) {
      console.log(error);
    }
  });

  // Listen for disconnect events
  socket.on("disconnect", () => {
    console.log(`Client disconnected`);
  });
});

const port = process.env.PORT || 5002

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = { io };
