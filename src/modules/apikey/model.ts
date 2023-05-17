var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const apikeySchema = new Schema(
  {
    token: { type: String },
  },
  { timestamps: true }
);

const apikeyCollection = "apikey";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { apikeySchema, apikeyCollection };
