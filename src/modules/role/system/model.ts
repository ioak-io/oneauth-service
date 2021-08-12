var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const systemRoleSchema = new Schema(
  {
    name: { type: String },
  },
  { timestamps: true }
);

const systemRoleCollection = "role-system";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { systemRoleSchema, systemRoleCollection };
