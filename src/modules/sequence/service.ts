const { sequenceCollection, sequenceSchema } = require("./model");
const { getGlobalCollection, getCollection } = require("../../lib/dbutils");

export const createSequence = async (data: {
  field: string;
  context?: string;
  factor?: number;
  realm?: number;
  nextval?: number;
}) => {
  const factor = data.factor || 1;
  const context = data.context || "na";
  const realm = data.realm || 100;
  const nextval = data.nextval || 1;
  let model;
  if (realm) {
    model = getCollection(realm, sequenceCollection, sequenceSchema);
  } else {
    model = getGlobalCollection(sequenceCollection, sequenceSchema);
  }

  const existingSequence = await model.findOne({
    field: data.field,
    context,
  });

  if (existingSequence) {
    return existingSequence;
  }

  return await model.findOneAndUpdate(
    { field: data.field, context },
    {
      field: data.field,
      context,
      factor,
      nextval,
    },
    { upsert: true, new: true }
  );
};

export const nextval = async (data: {
  field: string;
  context?: string;
  realm?: number;
}) => {
  const context = data.context || "na";
  const realm = data.realm || 100;
  let model;
  if (realm) {
    model = getCollection(realm, sequenceCollection, sequenceSchema);
  } else {
    model = getGlobalCollection(sequenceCollection, sequenceSchema);
  }
  const sequence = await model.findOne({
    field: data.field,
    context,
  });
  if (!sequence) {
    return null;
  }
  await model.findOneAndUpdate(
    { field: data.field, context },
    { nextval: sequence.nextval + sequence.factor },
    { upsert: true, new: true }
  );
  return sequence.nextval;
};
