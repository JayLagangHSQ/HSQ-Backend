const express = require('express');
const formController = require('../controllers/formController');
const auth = require('../auth')
const {verify,verifyManager}  = auth;

const router = express.Router();

router.post('/newForm',verify, verifyManager, formController.addNewForm)
router.get('/',verify, formController.getAllForms)
router.post('/form',verify, formController.getFormByNameAndDepartment)
router.put('/form/edit',verify, verifyManager, formController.editForm)

module.exports = router;