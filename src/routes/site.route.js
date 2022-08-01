const express = require("express");
const router = express.Router();

const siteController = require("../controllers/site.controller");

router.get("/", siteController.homeController);
router.get("/secrets", siteController.secretController);
router.get("/logout", siteController.logoutController);

module.exports = router;