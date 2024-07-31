var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const attributedefSchema = new Schema(
  {
    reference: { type: String },
    name: { type: String },
    type: { type: String },
    options: { type: String },
  },
  { timestamps: true }
);

const attributedefCollection = "attributedef";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { attributedefSchema, attributedefCollection };
