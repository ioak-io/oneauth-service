import { validateMandatoryFields } from "../../lib/validation";
import { realmSchema, realmCollection } from "../realm/model";
import * as Helper from "./helper";
import * as UserRoleHelper from "../user/role/helper";

import { getCollection } from "../../lib/dbutils";

export const getRealms = async (req: any, res: any) => {
  const permissionMap = await UserRoleHelper.getPermissionsByUserId(req.user.user_id);
  const authorizedRealms = permissionMap['ADMIN'];
  if (!authorizedRealms || authorizedRealms.length === 0) {
    res.status(200);
    res.send([]);
    res.end();
  }
  const model = getCollection(realmCollection, realmSchema);
  const realms = await model.find({ realm: { $in: authorizedRealms } });
  res.status(200);
  res.send(realms);
  res.end();
};

export const introspect = async (req: any, res: any) => {
  const model = getCollection(realmCollection, realmSchema);
  const realms = await model.find({});
  res.status(200);
  res.send(realms);
  res.end();
};

export const getRealm = async (req: any, res: any) => {
  const realm = Number(req.params.realm);

  if (realm === 100) {
    res.status(200);
    // res.send({
    //   realm,
    //   name: "Admin realm",
    //   description: "Admin realm",
    //   site: {
    //     layout: "split", // split, centered
    //     background:
    //       "https://images.unsplash.com/photo-1514539079130-25950c84af65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjk0OTh8MHwxfHNlYXJjaHw2fHxmYWlyeXxlbnwwfDB8fHwxNjI1MjAzOTA3&ixlib=rb-1.2.1&q=80&w=1080",
    //   },
    // });
    res.send({
      realm,
      name: "Admin realm",
      description: "Admin realm",
      site: {
        container: false,
        signupVariant: "bottom", //top-one-line, top-two-line, bottom
        borderRadius: "small", // none, small, medium, large
        layout: "full", // split, centered
        background:
          "https://images.unsplash.com/photo-1514539079130-25950c84af65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjk0OTh8MHwxfHNlYXJjaHw2fHxmYWlyeXxlbnwwfDB8fHwxNjI1MjAzOTA3&ixlib=rb-1.2.1&q=80&w=1080",
      },
    });
    res.end();
    return;
  }

  const model = getCollection(realmCollection, realmSchema);
  const realmResponse = await model.findOne({ realm });
  res.status(200);
  res.send(realmResponse);
  res.end();
};

export const updateRealm = async (req: any, res: any) => {
  const payload = req.body;
  const realm = req.params.realm;
  const permissionMap = await UserRoleHelper.getPermissionsByUserId(req.user.user_id);
  const authorizedRealms = permissionMap['ADMIN'];
  if (!authorizedRealms.includes(realm)) {
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
  if (!validateMandatoryFields(res, payload, ["name", "description"])) {
    return;
  }

  const model = getCollection(realmCollection, realmSchema);
  const outcome = await model.updateOne({ realm }, { ...payload, realm });
  res.status(200);
  res.send(await model.findOne({realm}));
  res.end();
};

export const createRealm = async (req: any, res: any) => {
  const payload = req.body;
  if (!validateMandatoryFields(res, payload, ["name", "description"])) {
    return;
  }

  const model = getCollection(realmCollection, realmSchema);
  const realm = await Helper.generateRealmNumber();
  const outcome = await model.create({ ...payload, realm });
  await UserRoleHelper.modifyUserRole({
    action: "ADD",
    roleName: "ADMIN",
    userId: req.user.user_id,
    scope: outcome.realm.toString()
  });
  res.status(200);
  res.send(outcome);
  res.end();
};
