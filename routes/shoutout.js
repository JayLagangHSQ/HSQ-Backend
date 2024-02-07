const express = require('express');
const shoutoutController = require('../controllers/shoutoutController');
const auth = require('../auth')
const {verify, verifyManager}  = auth;

const shoutoutAuth = require('../middlewares/shoutoutAuth')

const {verifyAllowedToChangeShoutout} = shoutoutAuth;

const router = express.Router();

//route for uploading new shoutout
router.post("/new",verify, shoutoutController.createNewShoutout);

// route for editing a shoutout
router.put("/:shoutoutId/edit", verify, verifyAllowedToChangeShoutout, shoutoutController.updateShoutout);

// route for deleting a shoutout
router.delete("/:shoutoutId/delete", verify, verifyAllowedToChangeShoutout, shoutoutController.deleteShoutout)

// route to retrieve all shoutout
router.get("/", verify, shoutoutController.retrieveAll)

// route to retrieve all shoutout created by the user
router.get("/myShoutouts", verify, shoutoutController.retrieveMyCreatedShoutout)

module.exports = router;