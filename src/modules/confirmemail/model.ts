var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const confirmemailSchema = new Schema(
  {
    userId: { type: String },
    code: { type: String },
  },
  { timestamps: true }
);

const confirmemailCollection = "confirmemail";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { confirmemailSchema, confirmemailCollection };
