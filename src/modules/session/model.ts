var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const sessionSchema = new Schema(
  {
    session_id: { type: String },
    refresh_token: { type: String },
    user_id: { type: String },
    claims: { type: Object },
    iat: { type: Date },
    eat: { type: Date },
  },
  { timestamps: true }
);

const sessionCollection = "session";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { sessionSchema, sessionCollection };
