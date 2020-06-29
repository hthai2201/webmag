const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const bcrypt = require("bcryptjs");
const uuidv4 = require("uuid").v4;
const config = require("./../config");
const jwt = require("jsonwebtoken");

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

//method
userSchema.method({
  token() {
    const playload = {
      exp: moment().add(30, "days").unix(),
      iat: moment().unix(),
      id: this._id,
    };
    let token = jwt.sign(playload, config.authentication.jwtPrivateKey);

    return token;
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});
//static
userSchema.statics = {
  async oAuthLogin({ service, id, email, fullname, avatar }) {
    console.log(service);
    let user = await this.findOne({
      $or: [{ [`services.${service}`]: id }, { email }],
    });
    console.log(user);
    if (!user) {
      user = await this.create({
        services: { [service]: id },
        email,
        password: uuidv4(),
        fullname,
        avatar,
      });
    }
    let token = user.token();
    user = await user.toObject();
    user.token = token;
    return user;
  },
};
/**
 * @typedef User
 */
module.exports = mongoose.model("User", userSchema);
