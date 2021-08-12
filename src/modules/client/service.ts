import { v4 as uuid } from "uuid";
import { validateMandatoryFields } from "../../lib/validation";
import { clientSchema, clientCollection } from "../client/model";
import {
  checkSystemPermission,
  grantSystemPermission,
  getPermittedSystemResources,
} from "../user/role/SystemPermissionService";

import { getCollection } from "../../lib/dbutils";

import * as RealmHelper from "../realm/helper";

const selfRealm = 100;

export const getClients = async (req: any, res: any) => {
  const permittedResources = await getPermittedSystemResources({
    nameList: ["system-admin", "system-user"],
    user_id: req.user.user_id,
  });
  const permittedClients = permittedResources
    .filter((item: any) => item.resource_name === "client")
    .map((item: any) => item.resource_id);
  const model = getCollection(selfRealm, clientCollection, clientSchema);
  const clients = (await model.find({})).map((item: any) => ({
    ...item._doc,
    editRights: permittedClients.includes(item.client_id),
  }));
  res.status(200);
  res.send(clients);
  res.end();
};

export const getClient = async (req: any, res: any) => {
  const client_id = req.params.client_id;
  const model = getCollection(selfRealm, clientCollection, clientSchema);
  const clientData = await model.findOne({ client_id });
  res.status(200);
  res.send(clientData);
  res.end();
};

export const updateClient = async (req: any, res: any) => {
  const payload = req.body;
  const client_id = req.params.client_id;
  if (
    !validateMandatoryFields(res, payload, ["name", "description", "redirect"])
  ) {
    return;
  }

  if (
    !(await checkSystemPermission({
      name: "system-admin",
      resource_name: "client",
      resource_id: client_id,
      user_id: req.user.user_id,
    }))
  ) {
    res.status(403);
    res.send({
      error: {
        message:
          "Not authorized to perform requested action on the chosen resource",
      },
    });
    res.end();
    return;
  }

  const model = getCollection(selfRealm, clientCollection, clientSchema);
  const outcome = await model.updateOne(
    { client_id },
    { ...payload, client_id }
  );
  res.status(200);
  res.send({ ...payload, client_id });
  res.end();
};

export const createClient = async (req: any, res: any) => {
  const payload = req.body;
  if (
    !validateMandatoryFields(res, payload, ["name", "description", "redirect"])
  ) {
    return;
  }

  const model = getCollection(selfRealm, clientCollection, clientSchema);
  const realm = await RealmHelper.generateRealmNumber();
  const client_id = uuid();
  const outcome = await model.create({ ...payload, realm, client_id });
  await grantSystemPermission({
    name: "system-admin",
    user_id: req.user.user_id,
    resource_name: "client",
    resource_id: client_id,
  });
  await grantSystemPermission({
    name: "system-user",
    user_id: req.user.user_id,
    resource_name: "client",
    resource_id: client_id,
  });
  res.status(200);
  res.send(outcome);
  res.end();
};
