const express = require('express');
const articleController = require('../controllers/articleController');
const auth = require('../auth')
const {verify,verifyManager}  = auth;

const router = express.Router();

router.post('/newArticle',verify, verifyManager, articleController.addNewArticle)
router.put('/article/edit',verify, verifyManager, articleController.editArticle)
router.get('/',verify, articleController.getAllArticle)
router.post('/article',verify, articleController.getArticleByTitle)

module.exports = router;