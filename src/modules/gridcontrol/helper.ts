import { validateMandatoryFields } from "../../lib/validation";
import { checkSystemPermission } from "../user/role/SystemPermissionService";

export const validateGridcontrolEditPermissionForRealm = async (
  res: any,
  payload: any,
  realm: number,
  user_id: string
) => {
  if (!validateMandatoryFields(res, payload, ["client_id"])) {
    return false;
  }

  if (
    !(await checkSystemPermission({
      name: "system-admin",
      resource_name: "realm",
      resource_id: realm.toString(),
      user_id,
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
    return false;
  }

  return true;
};

export const validateGridcontrolEditPermissionForClient = async (
  res: any,
  payload: any,
  client_id: string,
  user_id: string
) => {
  if (!validateMandatoryFields(res, payload, ["realm"])) {
    return false;
  }

  if (
    !(await checkSystemPermission({
      name: "system-admin",
      resource_name: "client",
      resource_id: client_id,
      user_id,
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
    return false;
  }

  return true;
};
