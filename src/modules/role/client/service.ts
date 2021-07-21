import { getCollection } from "../../../lib/dbutils";
import { clientRoleCollection, clientRoleSchema } from "./model";
import * as Helper from "./helper";
import {
  checkSystemPermission,
  getPermittedSystemResources,
} from "../system/user/service";
import { validateMandatoryFields } from "../../../lib/validation";

const selfRealm = 100;

export const getRealms = async (req: any, res: any) => {
  res.status(200);
  // res.send(realms);
  res.end();
};

export const getClientRoles = async (req: any, res: any) => {
  const roles = await Helper.getClientRoles({
    client_id: req.params.client_id,
  });
  res.status(200);
  res.send(roles);
  res.end();
};

export const createClientRole = async (req: any, res: any) => {
  const payload = req.body;
  const client_id = req.params.client_id;
  if (!validateMandatoryFields(res, payload, ["name"])) {
    return;
  }
  if (
    !checkSystemPermission({
      resource_id: client_id,
      resource_name: "client",
      user_id: req.user.user_id,
    })
  ) {
    res.status(403);
    res.end();
    return;
  }
  const role = await Helper.createClientRole(
    req.params.client_id,
    payload.name
  );
  res.status(200);
  res.send(role);
  res.end();
};
