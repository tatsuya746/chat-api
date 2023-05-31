const friendController = require("../controllers/FriendController");
const { verifyToken } = require("../controllers/middlewareController");

const router = require("express").Router();

//CREATE NEW FRIEND REQUEST
router.post("/new-request", verifyToken, friendController.createFriendRequest)

//GET ALL FRIEND REQUEST FOR A USER
router.get("/friend-requests/all", verifyToken, friendController.getAllFriendRequests)

//ACCEPT FRIEND REQUEST
router.post("/friend-request/accept", verifyToken, friendController.acceptRequest)

//REJECT FRIEND REQUEST
router.post("/friend-request/reject", verifyToken, friendController.rejectRequest)

//GET ALL FRIENDS OF A USER
router.get("/friends/all", verifyToken, friendController.getAllFriendsByUserId)


module.exports = router;