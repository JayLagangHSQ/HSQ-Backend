const express = require('express');
const mailController = require('../controllers/mailController');

const router = express.Router();

router.post("/passwordReset/GenerateToken", mailController.generateResetPasswordToken);
router.post('/passwordReset/verifyToken', mailController.verifyResetPasswordToken);
router.put("/passwordReset/reset", mailController.resetPassword)
module.exports = router;