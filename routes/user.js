const {
  verifyToken,
  verifyTokenAndUserAuthorization,
} = require("../controllers/middlewareController");
const userController = require("../controllers/userController");
const router = require("express").Router();
const upload = require("../utils/multer")

// GET ALL USERS
router.get("/", verifyToken, userController.getAllUsers);

// GET USER BY USERNAME AND USERNAMEID OR USERID
router.get("/search", verifyToken, userController.getUserByUsername)

// GET USER BY ID
router.get("/search/id", verifyToken, userController.getUserByUserID)

// DELETE USER
router.delete("/:id", verifyTokenAndUserAuthorization, userController.deleteUser);

// PROMOTE TO ADMIN
router.post("/admin/:id", userController.promoteToAdmin)

//CHANGE AVATAR
router.put("/avatar/update", verifyToken, upload.single("avatar"), userController.uploadAvatar);

//UPDATE PROFILE
router.put("/update/:id", verifyToken, userController.updateUserProfile)  

//SEND MAIL TO RESET PASSWORD
router.post("/reset-password", userController.sendMailToResetPassword)

//RESET PASSWORD
router.post("/reset-password/:token", userController.resetPassword)

// router.get("/get-all/avatar", uploadController.getListFiles);

module.exports = router;
