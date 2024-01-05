const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../auth')
const {verify, verifyManager}  = auth;
const image =require('../image');
const {uploadProfileImage, deleteProfileImage} = image;
const router = express.Router();

router.post("/login",  userController.loginUser);
router.post("/register",  userController.registerUser);
router.get("/user/detail", verify, userController.getUserDetail);
router.put('/user/profilePicture/update', verify,uploadProfileImage, deleteProfileImage, userController.updateProfilePicture);
router.put("/user/passwordUpdate", verify, userController.updatePassword);
router.post('/user/clockIn', verify, userController.clockIn);

module.exports = router;