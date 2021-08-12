import { getCollection } from "../../../lib/dbutils";
import { createRole, getRole, getRoles } from "../../role/system/service";
import { userRoleCollection, userRoleSchema } from "./model";

export const grantClientPermission = async (data: {
  realm: number;
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
  const model = getCollection(data.realm, userRoleCollection, userRoleSchema);
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

export const getPermittedClientResources = async (data: {
  realm: number;
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
  const model = getCollection(data.realm, userRoleCollection, userRoleSchema);
  const resources = await model.find({
    user_id: data.user_id,
    role_id: { $in: roles.map(({ _id }: any) => _id) },
  });
  return resources;
};
