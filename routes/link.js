const express = require('express');
const linkController = require('../controllers/linkController');
const auth = require('../auth')
const {verify, verifyManager}  = auth;

const router = express.Router();

router.post("/newLink", verify, verifyManager,  linkController.addNewLink);
router.get('/', verify, linkController.retrieveAllLink)

module.exports = router;