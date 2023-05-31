const conversationController = require("../controllers/conversationController");
const { verifyToken } = require("../controllers/middlewareController");

const router = require("express").Router();

//CREATE NEW CONVERSATION
router.post("/new-conversation", verifyToken, conversationController.createNewConversation)

//GET ALL CONVERSATIONS
router.get("/all", verifyToken, conversationController.getAllConversation )

//GET CONVERSATIONS BY USERID
router.get('/conversations/all', verifyToken, conversationController.getConversationByUserId)


//GET CONVERSATIONS BY CONVERSATIONiD
router.get('/conversations/', verifyToken, conversationController.getConversationByConversationId)

module.exports = router;