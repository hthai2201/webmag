const express = require("express");
const router = express.Router();

const generalRouter = require("./gereral.router");
const postRouter = require("./post.router");
const tagRouter = require("./tag.router");
const categoryRouter = require("./category.router");
const userRouter = require("./user.router");
router.use("/", generalRouter);
router.use("/posts", postRouter);
router.use("/categories", categoryRouter);
router.use("/tags", tagRouter);
router.use("/users", userRouter);
module.exports = router;
