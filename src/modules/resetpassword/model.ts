var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const resetpasswordSchema = new Schema(
  {
    userId: { type: String },
    resetCode: { type: String },
  },
  { timestamps: true }
);

const resetpasswordCollection = "resetpassword";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { resetpasswordSchema, resetpasswordCollection };
