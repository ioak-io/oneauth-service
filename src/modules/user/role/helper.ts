import mongoose from 'mongoose';
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import * as RoleHelper from '../../role/helper';
import * as UserHelper from '../helper';
import { userRoleCollection, userRoleSchema } from "./model";
import { isEmptyOrSpaces } from '../../../lib/Utils';
const { getCollection } = require("../../../lib/dbutils");

export const getUserRoles = async (realm?: number) => {
  const model = getCollection(userRoleCollection, userRoleSchema, realm);

  return await model.find();
};

export const modifyUserRole = async (
  payload: {
    action: "ADD" | "REMOVE",
    userId: string,
    userEmail: string,
    roleName: string,
    scope: string | null
  },
  realm?: number,
) => {

  if (payload.action !== 'ADD' && payload.action !== 'REMOVE') {
    return { message: `Invalid role action [${payload.action}]. Supported actions are [ADD | REMOVE]` };
  }

  const role = await RoleHelper.getRoleByName(payload.roleName, realm);

  if (!role) {
    return { "message": `Role [${payload.roleName}] does not exist` };
  }

  const roleId = role._id;

  if (!isEmptyOrSpaces(payload.userId) && !mongoose.Types.ObjectId.isValid(payload.userId)) {
    return { "message": `User ID [${payload.userId}] is invalid` };
  }

  let user = null;

  if (!isEmptyOrSpaces(payload.userId)) {
    user = await UserHelper.getUserById(payload.userId, realm);
  } else {
    user = await UserHelper.getUserByEmail(payload.userEmail, realm);
  }

  if (!user && !isEmptyOrSpaces(payload.userId)) {
    return { "message": `User ID [${payload.userId}] does not exist` };
  }
  if (!user && isEmptyOrSpaces(payload.userId)) {
    return { "message": `User with email [${payload.userEmail}] does not exist` };
  }

  const userId = user._id;

  const model = getCollection(
    userRoleCollection,
    userRoleSchema,
    realm
  );

  const scope = isEmptyOrSpaces(payload.scope) ? null : payload.scope;

  const existingUserRole = await model.find({ userId, roleId, scope: payload.scope });

  if (existingUserRole.length > 0 && payload.action === 'ADD') {
    return { message: `Role [${role.name}] with scope [${scope}] already exists for the user [${user.email}]` };
  }
  if (payload.action === 'ADD') {
    return await model.create({ userId, roleId, scope: payload.scope });
  }
  if (existingUserRole.length === 0 && payload.action === 'REMOVE') {
    return { message: `Role [${role.name}] with scope [${scope}] does not exist for the user [${user.email}]` };
  }
  await model.deleteMany({ userId, roleId, scope: payload.scope });
  return { message: `Role [${role.name}] with scope [${scope}] removed for user [${user.email}]` };
};

export const deleteUserRole = async (_id: string, realm?: number) => {
  const model = getCollection(userRoleCollection, userRoleSchema, realm);

  await model.remove({ _id });
  return { message: "Role removed from user", }
};
