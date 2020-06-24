const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const bcrypt = require("bcryptjs");
const uuidv4 = require("uuid").v4;
const config = require("./../config");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      maxlength: 20,
      minlength: 2,
      trim: true,
    },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      maxlength: 50,
      minlength: 2,
      trim: true,
    },
    pseudonym: {
      type: String,
      maxlength: 50,
      minlength: 2,
      trim: true,
    },
    dob: {
      type: Date,
    },
    avatar: {
      type: String,
      trim: true,
    },
    services: {
      facebook: String,
      google: String,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    expRole: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();

    const rounds = config.authentication.saltRounds;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre("update", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const rounds = config.authentication.saltRounds;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * @typedef User
 */
module.exports = mongoose.model("User", userSchema);
