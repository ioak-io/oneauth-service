import { isEmptyOrSpaces } from "../../../lib/Utils";
import { validateMandatoryFields } from "../../../lib/validation";
import * as Helper from "./helper";

export const getUserRoles = async (req: any, res: any, realm?: number) => {
  const data: any = await Helper.getUserRoles(realm);
  res.status(200);
  res.send(data);
  res.end();
};

export const modifyUserRole = async (req: any, res: any, realm?: number) => {
  const payload = req.body;
  if (!validateMandatoryFields(res, payload, ["action", "roleName"])) {
    return;
  }
  if (isEmptyOrSpaces(payload.userId) && isEmptyOrSpaces(payload.userEmail)) {

    res.status(400);
    res.send({
      error: { missingFields: ['userId or userEmail'] },
    });
    res.end();
    return;
  }
  const data: any = await Helper.modifyUserRole(req.body, realm);
  res.status(200);
  res.send(data);
  res.end();
};
