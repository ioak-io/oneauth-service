var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const clientRoleUserSchema = new Schema(
  {
    user_id: { type: String },
    role_id: { type: String },
    resource_name: { type: String },
    resource_id: { type: String },
  },
  { timestamps: true }
);

const clientRoleUserCollection = "role-client-user";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { clientRoleUserSchema, clientRoleUserCollection };
