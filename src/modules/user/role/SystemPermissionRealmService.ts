import { getCollection } from "../../../lib/dbutils";
import { getRoles, createRole, getRole } from "../../role/system/service";
import { userRoleCollection, userRoleSchema } from "./model";

const selfRealm = 100;

export const getSystemPermissionForRealm = async (req: any, res: any) => {
  const realm = Number(req.params.realm);
  const model = getCollection(selfRealm, userRoleCollection, userRoleSchema);
  const result = await model.find({
    resource_name: "realm",
    resource_id: realm,
  });
  res.status(200);
  res.send(result);
  res.end();
};

export const addSystemPermissionForRealm = async (req: any, res: any) => {
  const realm = Number(req.params.realm);
  const userId = req.params.user_id;
  const roleId = req.query.role_id;
  if (!roleId) {
    res.status(400);
    res.send({
      error: {
        message: "Query parameter (roleId) is missing",
      },
    });
    res.end();
  }
  const model = getCollection(selfRealm, userRoleCollection, userRoleSchema);
  const outcome = await model.updateOne(
    {
      user_id: userId,
      role_id: roleId,
      resource_name: "realm",
      resource_id: realm,
    },
    {},
    { upsert: true }
  );
  res.status(200);
  res.send({
    message: outcome.nModified === 0 ? "Role added" : "Role already exists",
  });
  res.end();
};

export const addSystemPermissionForRealmForMultipleUsers = async (
  req: any,
  res: any
) => {
  const realm = Number(req.params.realm);
  const roleId = req.query.role_id;
  const payload = req.body;
  if (!roleId) {
    res.status(400);
    res.send({
      error: {
        message: "Query parameter (roleId) is missing",
      },
    });
    res.end();
  }
  if (!payload?.user_id) {
    res.status(400);
    res.send({
      error: {
        message: "user_id missing in request body",
      },
    });
    res.end();
  }
  const model = getCollection(selfRealm, userRoleCollection, userRoleSchema);
  let count = 0;
  for (const userId of payload.user_id) {
    const outcome = await model.updateOne(
      {
        user_id: userId,
        role_id: roleId,
        resource_name: "realm",
        resource_id: realm,
      },
      {},
      { upsert: true }
    );
    if (outcome.nModified === 0) {
      count += 1;
    }
  }
  res.status(200);
  res.send({
    added: count,
  });
  res.end();
};

export const deleteSystemPermissionForRealm = async (req: any, res: any) => {
  const realm = Number(req.params.realm);
  const userId = req.params.user_id;
  const roleId = req.query.role_id;
  if (!roleId) {
    res.status(400);
    res.send({
      error: {
        message: "Query parameter (roleId) is missing",
      },
    });
    res.end();
  }
  const model = getCollection(selfRealm, userRoleCollection, userRoleSchema);
  const outcome = await model.deleteOne({
    user_id: userId,
    role_id: roleId,
    resource_name: "realm",
    resource_id: realm,
  });
  res.status(200);
  res.send({
    message: outcome.deletedCount === 0 ? "No role found" : "Role deleted",
  });
  res.end();
};
