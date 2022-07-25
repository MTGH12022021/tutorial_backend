const express = require("express");
const router = express.Router();

const registerController = require("../controllers/register.controller");

router.get("/",registerController.registerGET);
router.post("/",registerController.registerPOST);

module.exports = router;