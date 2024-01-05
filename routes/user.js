const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../auth')
const {verify, verifyManager}  = auth;

const router = express.Router();

router.post("/login",  userController.loginUser);
router.post("/register",  userController.registerUser);
router.get("/user/detail", verify, userController.getUserDetail);
router.put("/user/passwordUpdate", verify, userController.updatePassword);
router.post('/user/clockIn', verify, userController.clockIn);

module.exports = router;