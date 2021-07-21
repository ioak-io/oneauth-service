import { validateMandatoryFields } from "../../lib/validation";
import { realmSchema, realmCollection } from "../realm/model";
import {
  checkSystemPermission,
  grantSystemPermission,
  getPermittedSystemResources,
} from "../role/system/user/service";
import * as Helper from "./helper";

import { getCollection } from "../../lib/dbutils";

const selfRealm = 100;

export const getRealms = async (req: any, res: any) => {
  const permittedResources = await getPermittedSystemResources({
    nameList: ["system-admin", "system-user"],
    user_id: req.user.user_id,
  });
  const permittedRealms = permittedResources
    .filter((item: any) => item.resource_name === "realm")
    .map((item: any) => item.resource_id);
  const model = getCollection(selfRealm, realmCollection, realmSchema);
  const realms = await model.find({ realm: { $in: permittedRealms } });
  res.status(200);
  res.send(realms);
  res.end();
};

export const introspect = async (req: any, res: any) => {
  const model = getCollection(selfRealm, realmCollection, realmSchema);
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

  const model = getCollection(selfRealm, realmCollection, realmSchema);
  const realmResponse = await model.findOne({ realm });
  res.status(200);
  res.send(realmResponse);
  res.end();
};

export const updateRealm = async (req: any, res: any) => {
  const payload = req.body;
  if (payload.upload?.logo) {
    const logoUrl = await Helper.processFileUpload(
      payload.upload.logo,
      "logo",
      req.params.realm
    );
    payload.site.logo = logoUrl;
  }
  if (payload.upload?.background) {
    const backgroundUrl = await Helper.processFileUpload(
      payload.upload.background,
      "background",
      req.params.realm
    );
    payload.site.background = backgroundUrl;
  }
  const realm = req.params.realm;
  if (!validateMandatoryFields(res, payload, ["name", "description"])) {
    return;
  }

  if (
    !(await checkSystemPermission({
      name: "system-admin",
      resource_name: "realm",
      resource_id: realm,
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

  const model = getCollection(selfRealm, realmCollection, realmSchema);
  const outcome = await model.updateOne({ realm }, { ...payload, realm });
  res.status(200);
  res.send({ ...payload, realm });
  res.end();
};

export const createRealm = async (req: any, res: any) => {
  const payload = req.body;
  if (!validateMandatoryFields(res, payload, ["name", "description"])) {
    return;
  }

  const model = getCollection(selfRealm, realmCollection, realmSchema);
  const realm = await Helper.generateRealmNumber();
  const outcome = await model.create({ ...payload, realm });
  await grantSystemPermission({
    name: "system-admin",
    user_id: req.user.user_id,
    resource_name: "realm",
    resource_id: realm,
  });
  await grantSystemPermission({
    name: "system-user",
    user_id: req.user.user_id,
    resource_name: "realm",
    resource_id: realm,
  });
  res.status(200);
  res.send(outcome);
  res.end();
};
