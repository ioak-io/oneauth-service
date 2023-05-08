var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const roleSchema = new Schema(
  {
    name: { type: String },
  },
  { timestamps: true, minimize: false }
);

const roleCollection = "role";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { roleSchema, roleCollection };
