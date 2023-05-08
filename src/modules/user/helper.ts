const axios = require("axios");
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { userCollection, userSchema } from "./model";
const { getCollection } = require("../../lib/dbutils");

export const getUsers = async (realm?: number) => {
  const model = getCollection(userCollection, userSchema, realm);

  return await model.find();
};

export const getUserById = async (id: string, realm?: number) => {
  const model = getCollection(userCollection, userSchema, realm);

  const users = await model.find({ _id: id });
  if (users.length > 0) {
    return users[0];
  }
  return null;
};


export const getUserByEmail = async (email: string, realm?: number) => {
  const model = getCollection(userCollection, userSchema, realm);

  const users = await model.find({ email: email.toLowerCase() });
  if (users.length > 0) {
    return users[0];
  }
  return null;
};
