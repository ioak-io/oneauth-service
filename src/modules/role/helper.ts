const axios = require("axios");
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { roleCollection, roleSchema } from "./model";
const { getCollection } = require("../../lib/dbutils");

export const getRoles = async (realm?: number) => {
  const model = getCollection(roleCollection, roleSchema, realm);

  return await model.find();
};

export const getRoleByName = async (name: string, realm?: number) => {
  const model = getCollection(roleCollection, roleSchema, realm);

  const roles = await model.find({ name });
  if (roles.length > 0) {
    return roles[0];
  }
  return null;
};

export const addRole = async (
  name: string,
  realm?: number,
) => {
  const model = getCollection(
    roleCollection,
    roleSchema,
    realm
  );

  const existingRole = await model.find({ name });
  if (existingRole.length > 0) {
    return { message: "Role already exists" }
  }

  return await model.create({ name });
};

export const deleteRole = async (_id: string, realm?: number) => {
  const model = getCollection(roleCollection, roleSchema, realm);

  await model.remove({ _id });
  return { message: "Role removed", }
};
