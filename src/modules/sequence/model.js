var mongoose = require('mongoose');

const Schema = mongoose.Schema;
const sequenceSchema = new Schema(
  {
    field: { type: String },
    context: { type: String },
    nextval: { type: Number },
    factor: { type: Number },
  },
  { timestamps: true }
);

const sequenceCollection = 'sequence';

module.exports = { sequenceSchema, sequenceCollection };
