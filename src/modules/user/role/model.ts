var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userRoleSchema = new Schema(
  {
    userId: { type: String },
    roleId: { type: String },
    scope: { type: String },
  },
  { timestamps: true, minimize: false }
);

const userRoleCollection = "user.role";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { userRoleSchema, userRoleCollection };
