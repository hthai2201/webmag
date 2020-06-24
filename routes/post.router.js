const express = require("express");
const router = express.Router();

const { postController } = require("../controllers");

router.get("/:slug", postController.get);
// router.get('/', generalController.get)
module.exports = router;
