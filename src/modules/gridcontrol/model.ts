var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const gridcontrolSchema = new Schema(
  {
    realm: { type: Number },
    client_id: { type: String },
    approved_by_realm: { type: Boolean },
    approved_by_client: { type: Boolean },
  },
  { timestamps: true }
);

const gridcontrolCollection = "gridcontrol";

// module.exports = mongoose.model('bookmarks', articleSchema);
export { gridcontrolSchema, gridcontrolCollection };
