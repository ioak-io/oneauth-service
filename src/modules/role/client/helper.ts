import { getCollection } from "../../../lib/dbutils";
import { clientRoleCollection, clientRoleSchema } from "./model";

const selfRealm = 100;

export const getClientRoles = async (data: {
  client_id: string;
  idList?: string[];
  nameList?: string[];
}) => {
  const model = getCollection(
    selfRealm,
    clientRoleCollection,
    clientRoleSchema
  );
  let roles = [];
  if (data.idList) {
    roles = await model.find({
      client_id: data.client_id,
      _id: { $in: data.idList },
    });
  } else if (data.nameList) {
    roles = await model.find({
      client_id: data.client_id,
      name: { $in: data.nameList },
    });
  } else {
    roles = await model.find({
      client_id: data.client_id,
    });
  }
  return roles;
};

export const getClientRole = async (data: {
  client_id: string;
  id?: string;
  name?: string;
}) => {
  const model = getCollection(
    selfRealm,
    clientRoleCollection,
    clientRoleSchema
  );
  let role = null;
  if (data.id) {
    role = await model.findOne({ _id: data.id });
  } else {
    role = await model.findOne({ name: data.name });
  }
  return role;
};

export const createClientRole = async (client_id: string, name: string) => {
  const model = getCollection(
    selfRealm,
    clientRoleCollection,
    clientRoleSchema
  );
  const outcome = await model.updateOne(
    { client_id, name },
    { client_id, name },
    { upsert: true }
  );
  return outcome;
};
