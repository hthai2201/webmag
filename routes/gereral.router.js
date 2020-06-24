const express = require("express");
const router = express.Router();
const { loginValidator } = require("../validator");
const { generalController } = require("../controllers");

router.get("/", generalController.home);
router.get("/popular", generalController.popular);
router.get("/search", generalController.search);
router.get("/login", generalController.login);
router.post("/login", loginValidator(), generalController.login_post);
router.get("/register", generalController.register);
module.exports = router;
