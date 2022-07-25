const express = require("express");
const router = express.Router();

const forgotPasswordController = require("../controllers/forgotpassword.controller");

router.get("/", forgotPasswordController.forgotPasswordGET);
router.post("/", forgotPasswordController.forgotPasswordPOST);

module.exports = router;