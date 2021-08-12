var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const clientSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    client_id: { type: String },
    realm: { type: Number },
    redirect: { type: String },
  },
  { timestamps: true }
);

const clientCollection = "client";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { clientSchema, clientCollection };
