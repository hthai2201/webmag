const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const bcrypt = require("bcryptjs");

const config = require("../config");

const roleSchema = new mongoose.Schema(
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
    value: {
      type: Number,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Role
 */
module.exports = mongoose.model("Role", roleSchema);
