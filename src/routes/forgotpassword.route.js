const express = require("express");
const router = express.Router();

const forgotPasswordController = require("../controllers/forgotpassword.controller");

router.get("/", forgotPasswordController.forgotPasswordGET);
router.post("/mail", forgotPasswordController.forgotPasswordMailPOST);

router.get("/reset/:mail", forgotPasswordController.forgotPasswordResetGET)
router.post("/reset", forgotPasswordController.ResetPOST)
module.exports = router;