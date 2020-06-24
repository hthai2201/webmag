const express = require("express");
const router = express.Router();

const { tagController } = require("../controllers");

router.get("/:slug", tagController.get);
// router.get('/', generalController.get)
module.exports = router;
