var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const realmSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    realm: { type: Number },
  },
  { timestamps: true }
);

const realmCollection = "realm";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { realmSchema, realmCollection };
