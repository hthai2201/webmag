const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const bcrypt = require("bcryptjs");

const config = require("../config");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      trim: true,
    },
    slug: {
      type: String,

      trim: true,
    },
    color: {
      type: String,

      trim: true,
    },
    isRoot: {
      type: Boolean,
      default: true,
    },
    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
//statis
// categorySchema.statics.getAll = async function (page = 1, perPage = 10) {
//   return this.find().populate("category").exec();
//   // return this.aggregate([{ $skip: (page - 1) * perPage }, { $limit: perPage }]);
// };
/**
 * @typedef Category
 */
module.exports = mongoose.model("Category", categorySchema);
