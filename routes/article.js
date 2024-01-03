const express = require('express');
const articleController = require('../controllers/articleController');
const auth = require('../auth')
const {verify,verifyManager}  = auth;

const image =require('../image');
const {uploadMultipleImage, deleteImage} = image;

const router = express.Router();

router.post('/newArticle',verify, verifyManager,uploadMultipleImage, articleController.addNewArticle)
router.put('/article/edit/:articleId',verify, verifyManager,uploadMultipleImage, articleController.editArticle)
router.delete('/article/edit/deleteImage/:articleId',verify, verifyManager,deleteImage,articleController.removeArticleImage)
router.put('/article/edit/addImage/:articleId',verify, verifyManager,uploadMultipleImage,articleController.addArticleImage)
router.get('/',verify, articleController.getAllArticle)
router.post('/article',verify, articleController.getArticleByTitleAndDepartment)
router.get('/article/:articleId',verify, articleController.getArticleById)

module.exports = router;