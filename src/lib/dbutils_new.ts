import mongoose from "mongoose";

export const getCollection = (
  realm: string,
  collection: any,
  schema: any
): any => {
  const db = mongoose.connection.useDb(`oa${realm}`);
  return db.model(collection, schema);
};

export const getGlobalCollection = (collection: any, schema: any): any => {
  const db = mongoose.connection.useDb(`oa`);
  return db.model(collection, schema);
};
