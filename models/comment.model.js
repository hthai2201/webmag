const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    replyComments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
      },
    ],
    like: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
//method
commentSchema.methods.addRefs = async function (prop, id) {
  this[prop] = this[prop] || [];
  if (!this[prop].includes(id)) {
    this[prop].push(id);
  }
  console.log(this, "this");
  await this.save();
  return this;
};
/**
 * @typedef Comment
 */
module.exports = mongoose.model("Comment", commentSchema);
