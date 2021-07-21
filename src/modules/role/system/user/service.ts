import { getCollection } from "../../../../lib/dbutils";
import { getRoles, createRole, getRole } from "../service";
import { systemRoleUserCollection, systemRoleUserSchema } from "./model";

const selfRealm = 100;

export const getRealms = async (req: any, res: any) => {
  res.status(200);
  // res.send(realms);
  res.end();
};

export const grantSystemPermission = async (data: {
  id?: string;
  name?: string;
  user_id: string;
  resource_name: string;
  resource_id: string;
}) => {
  let role = await getRole({
    id: data.id,
    name: data.name,
  });
  if (!role && data.name) {
    role = await createRole(data.name);
  }
  const model = getCollection(
    selfRealm,
    systemRoleUserCollection,
    systemRoleUserSchema
  );
  const outcome = await model.updateOne(
    {
      user_id: data.user_id,
      role_id: role._id,
      resource_name: data.resource_name,
      resource_id: data.resource_id,
    },
    {},
    { upsert: true }
  );
};

export const checkSystemPermission = async (data: {
  id?: string;
  name?: string;
  user_id: string;
  resource_name: string;
  resource_id: string;
}) => {
  const role = await getRole({
    id: data.id,
    name: data.name,
  });
  if (!role) {
    return false;
  }
  const model = getCollection(
    selfRealm,
    systemRoleUserCollection,
    systemRoleUserSchema
  );
  const outcome = await model.findOne({
    user_id: data.user_id,
    role_id: role._id,
    resource_name: data.resource_name,
    resource_id: data.resource_id,
  });
  return !!outcome;
};

export const getPermittedSystemResources = async (data: {
  idList?: string[];
  nameList?: string[];
  user_id: string;
}) => {
  const roles = await getRoles({
    idList: data.idList,
    nameList: data.nameList,
  });
  if (roles.length === 0) {
    return [];
  }
  const model = getCollection(
    selfRealm,
    systemRoleUserCollection,
    systemRoleUserSchema
  );
  const resources = await model.find({
    user_id: data.user_id,
    role_id: { $in: roles.map(({ _id }: any) => _id) },
  });
  return resources;
};
