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
router.put('/:questionnaireId/toggleOtherOption', verify,verifyEditAuthorization, formBuilderController.toggleOtherOption)
router.put('/:questionnaireId/toggleIsRequired', verify,verifyEditAuthorization, formBuilderController.toggleIsRequired)
router.put('/:questionnaireId/textIsLongAnswerToggle', verify,verifyEditAuthorization, formBuilderController.textIsLongAnswerToggle)
router.put('/:questionnaireId/newChoice', verify,verifyEditAuthorization, formBuilderController.addChoiceOption)
router.put('/:questionnaireId/deleteChoice', verify,verifyEditAuthorization, formBuilderController.deleteAnOption)
router.put('/:questionnaireId/updateMultipleOptionName', verify,verifyEditAuthorization, formBuilderController.updateMultipleChoiceOptionName)
router.put('/:questionnaireId/newCandidate', verify,verifyEditAuthorization, formBuilderController.addCandidateOption)
router.put('/:questionnaireId/updateCandidateName', verify,verifyEditAuthorization, formBuilderController.updateCandidateName)
router.put('/:questionnaireId/updateQuestion', verify,verifyEditAuthorization, formBuilderController.updateFieldQuestion)
router.put('/:questionnaireId/changeRatingLevel', verify,verifyEditAuthorization, formBuilderController.changeRatingLevel)
router.put('/:questionnaireId/changeRatingSymbol', verify,verifyEditAuthorization, formBuilderController.changeRatingSymbol)
router.put('/:questionnaireId/updateFieldsIndexing', verify,verifyEditAuthorization,formBuilderController.updateFieldsIndexing)

module.exports = router;