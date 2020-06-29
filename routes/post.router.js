const express = require("express");
const router = express.Router();

const { postController } = require("../controllers");

router.get("/:slug", postController.get);
router.post("/:slug/comment", postController.comment);
router.get("/:slug/like", postController.like);

// router.get('/', generalController.get)
module.exports = router;
