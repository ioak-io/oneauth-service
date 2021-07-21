import { getCollection } from "../../../lib/dbutils";
import { systemRoleCollection, systemRoleSchema } from "./model";

const selfRealm = 100;

export const getRealms = async (req: any, res: any) => {
  res.status(200);
  // res.send(realms);
  res.end();
};

export const getRoles = async (data: {
  idList?: string[];
  nameList?: string[];
}) => {
  const model = getCollection(
    selfRealm,
    systemRoleCollection,
    systemRoleSchema
  );
  let roles = [];
  if (data.idList) {
    roles = await model.find({ _id: { $in: data.idList } });
  } else {
    roles = await model.find({ name: { $in: data.nameList } });
  }
  return roles;
};

export const getRole = async (data: { id?: string; name?: string }) => {
  const model = getCollection(
    selfRealm,
    systemRoleCollection,
    systemRoleSchema
  );
  let role = null;
  if (data.id) {
    role = await model.findOne({ _id: data.id });
  } else {
    role = await model.findOne({ name: data.name });
  }
  return role;
};

export const createRole = async (name: string) => {
  const model = getCollection(
    selfRealm,
    systemRoleCollection,
    systemRoleSchema
  );
  return await model.create({ name });
};
