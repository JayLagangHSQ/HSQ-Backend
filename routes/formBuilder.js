const express = require('express');
const auth = require('../auth')
const {verify}  = auth;

const router = express.Router();

router.post('/newForm', verify);

module.exports = router;