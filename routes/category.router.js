const express = require("express");
const router = express.Router();

const { categoryController } = require("../controllers");

router.get("/:slug", categoryController.get);
// router.get('/', generalController.get)
module.exports = router;
