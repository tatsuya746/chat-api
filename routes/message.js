const messageController = require("../controllers/messageController");
const { verifyToken } = require("../controllers/middlewareController");
const multer = require("multer");
const fs = require("fs");
const upload = require("../utils/multer")

const router = require("express").Router();

//CREATE NEW CONVERSATION
router.post(
  "/new-message",
  verifyToken,
  upload.array('images'),
  messageController.createNewMessage
);

//GET ALL MESSAGES BY CONVERSATION ID
router.get("/conversation/:id", verifyToken, messageController.getAllMessages);

//DELTE MESSAGE BY ID
router.delete("/delete/", verifyToken, messageController.deleteMessageById);

module.exports = router;
