var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    given_name: { type: String },
    family_name: { type: String },
    email: { type: String },
    name: { type: String },
    nickname: { type: String },
    picture: { type: String },
    metadata: { type: Object },
    email_verified: { type: Boolean },
    type: { type: String },
    hash: { type: String },
  },
  { timestamps: true }
);

const userCollection = "user";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { userSchema, userCollection };
