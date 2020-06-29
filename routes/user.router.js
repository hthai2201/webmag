const express = require("express");
const router = express.Router();
const { needUser } = require("../middlewares/auth.mdw");
const { userController } = require("../controllers");

router.get("/", needUser(), userController.get);
// router.get('/', generalController.get)
module.exports = router;
