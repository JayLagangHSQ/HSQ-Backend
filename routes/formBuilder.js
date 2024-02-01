const express = require('express');
const formBuilderController = require('../controllers/formBuilderController')
const auth = require('../auth')
const questionnaireAuth = require('../middlewares/questionnaireAuth')
const {verify}  = auth;
const {verifyEditAuthorization} = questionnaireAuth

const router = express.Router();

router.post('/newForm', verify, formBuilderController.createNewForm);
router.put('/:questionnaireId/newField', verify,verifyEditAuthorization, formBuilderController.addField)
router.put('/:questionnaireId/deleteField', verify,verifyEditAuthorization, formBuilderController.deleteField)
router.put('/:questionnaireId/edit', verify, formBuilderController.editField)
// router.post('/query', verify, formBuilderController)

module.exports = router;