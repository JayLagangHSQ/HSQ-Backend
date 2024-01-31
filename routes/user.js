const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../auth')
const {verify, verifyManager, verifyHR}  = auth;
const image =require('../image');
const {uploadProfileImage, deleteProfileImage} = image;

const {companyIdGenerator} = require('../middlewares/middlewares')

const router = express.Router();
router.post("/login",  userController.loginUser);
router.post("/register", verify,verifyHR,companyIdGenerator, userController.registerUser);
router.get("/user/detail", verify, userController.getUserDetail);
router.put('/user/profilePicture/update', verify,uploadProfileImage, deleteProfileImage, userController.updateProfilePicture);
router.put("/user/update/mobileNo", verify, userController.updateMobileNo)
router.put("/user/update/personalEmail", verify, userController.updatePersonalEmail)
router.put("/user/passwordUpdate", verify, userController.updatePassword);
router.post('/user/clockIn', verify, userController.clockIn);
router.put('/user/clockOut', verify, userController.clockOut);
router.post('/user/timesheet', verify, userController.retrieveTimeSheet);
router.post('/search', verify, userController.retrieveUserByNameAndDepartment);
router.put('/user/acknowledgeUpdate', verify, userController.acknowledgeUpdate);
module.exports = router;