import { v4 as uuidv4 } from "uuid";
import { getCollection } from "../../lib/dbutils";
import { apikeyCollection, apikeySchema } from "./model";

export const getApikeys = async (
  realm: number
) => {
  const model = getCollection(apikeyCollection, apikeySchema, realm);
  return await model.find({});
};

export const getApikeyByValue = async (
  token: string,
  realm?: number
) => {
  const model = getCollection(apikeyCollection, apikeySchema, realm);
  const response = await model.find({token});
  if (response.length > 0) {
    return response[0];
  }
  return null;
};

export const addApiKey = async (
  realm?: number
) => {
  const model = getCollection(apikeyCollection, apikeySchema, realm);
  return await model.create({
    token: uuidv4()
  })
};

export const deleteApiKey = async (
  token: string,
  realm?: number
) => {
  const model = getCollection(apikeyCollection, apikeySchema, realm);
  const response = await model.deleteMany({
    token
  })
  if (response.deletedCount === 0) {
    return { message: "API Key does not exist" }  
  }
  return { message: "API Key removed" }
};
