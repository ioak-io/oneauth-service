import { getCollection } from "../../lib/dbutils";
import { apikeyCollection, apikeySchema } from "./model";

export const getApikeys = async (
  realm: number
) => {
  const model = getCollection(apikeyCollection, apikeySchema, realm);
  return await model.find({});
};
