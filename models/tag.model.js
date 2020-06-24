const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const bcrypt = require("bcryptjs");

const config = require("../config");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      trim: true,
    },
    slug: {
      type: String,
      minlength: 2,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Tag
 */
module.exports = mongoose.model("Tag", tagSchema);
