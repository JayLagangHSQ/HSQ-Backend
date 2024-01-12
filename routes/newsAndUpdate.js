const express = require('express');
const auth = require('../auth');
const dotenv = require('dotenv').config().parsed;
const newsAndUpdateController = require('../controllers/newsAndUpdateController')

const {verify,verifyManager}  = auth;
const image =require('../image');
const {uploadMultipleImage, deleteImage} = image;

const router = express.Router();

const newsAndUpdateBucket = dotenv.NEWS_AND_UPDATE_BUCKET;

router.get('/', verify, newsAndUpdateController.retrieveAllNewsAndUpdate)
router.post('/upload',verify, verifyManager, uploadMultipleImage(newsAndUpdateBucket), newsAndUpdateController.postNewsAndUpdate)
router.put('/edit', verify, verifyManager, newsAndUpdateController.editNewsAndUpdate)


module.exports = router;

