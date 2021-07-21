var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const clientRoleSchema = new Schema(
  {
    name: { type: String },
    client_id: { type: String },
  },
  { timestamps: true }
);

const clientRoleCollection = "role-client";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { clientRoleSchema, clientRoleCollection };
