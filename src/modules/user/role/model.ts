var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userRoleSchema = new Schema(
  {
    client_id: { type: String },
    user_id: { type: String },
    role_id: { type: String },
    resource_name: { type: String },
    resource_id: { type: String },
  },
  { timestamps: true }
);

const userRoleCollection = "user.role";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { userRoleSchema, userRoleCollection };
