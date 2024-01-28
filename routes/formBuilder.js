const express = require('express');
const formBuilderController = require('../controllers/formBuilderController')
const auth = require('../auth')
const {verify}  = auth;

const router = express.Router();

router.post('/newForm', verify, formBuilderController.createNewForm);
router.put('/:questionnaireId/edit', verify, formBuilderController.editForm)
router.post('/query', verify)

module.exports = router;