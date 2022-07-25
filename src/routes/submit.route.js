const express = require("express");
const router = express.Router();

const submitController = require("../controllers/submit.controller")

router.get('/', submitController.submitGET);
router.post('/', submitController.submitPOST);


module.exports = router;