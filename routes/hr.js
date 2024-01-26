const express = require('express');
const hrController = require('../controllers/hrController');
const auth = require('../auth')
const {verify, verifyManager, verifyHR}  = auth;
const image =require('../image');
const router = express.Router();

router.post('/search',verify,verifyHR, hrController.retrieveUserByNameOrIdAndDepartment)

module.exports = router;