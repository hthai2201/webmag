const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const postConfig = require("../config").post;
const categoryModel = require("./category.model");
const tagModel = require("./tag.model");
const postStatusEnum = ["Denied", "waiting for publication", "Published"];
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    abstract: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    cover: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    isPremium: {
      type: Boolean,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    view: {
      type: Number,
      default: 0,
    },
    like: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: postStatusEnum,
      default: postStatusEnum[0],
    },
  },
  {
    timestamps: true,
  }
);
//index
postSchema.index(
  { title: "text", abstract: "text", content: "text" },
  { name: "post_fts_index" }
);
//hook
postSchema.post("find", (doc) => {
  // doc = doc.length
  //   ? doc.map((post) => {
  //       post.createdAt = moment().format("MMMM D, YYYY").toDate;
  //       return post;
  //     })
  //   : doc;
});

/**
 * @typedef Post
 */
module.exports = mongoose.model("Post", postSchema);
