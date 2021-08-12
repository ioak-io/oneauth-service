import { gridcontrolSchema, gridcontrolCollection } from "./model";

import { getCollection } from "../../lib/dbutils";

import * as Helper from "./helper";

const selfRealm = 100;

export const getGridcontrolByRealm = async (req: any, res: any) => {
  const realm = req.params.realm;

  const model = getCollection(
    selfRealm,
    gridcontrolCollection,
    gridcontrolSchema
  );
  const results = await model.find({
    realm,
  });
  res.status(200);
  res.send(results);
  res.end();
};

export const addGridcontrolByRealm = async (req: any, res: any) => {
  const payload = req.body;
  const realm = req.params.realm;
  if (
    !Helper.validateGridcontrolEditPermissionForRealm(
      res,
      payload,
      realm,
      req.user.user_id
    )
  ) {
    return;
  }

  const clientIdList = payload.client_id;

  const model = getCollection(
    selfRealm,
    gridcontrolCollection,
    gridcontrolSchema
  );
  const existingRecords = await model.find({
    client_id: { $in: clientIdList },
    realm,
  });
  const results: any = [];
  const existingRecordMap: any = {};
  existingRecords.forEach(
    (item: any) => (existingRecordMap[item.client_id] = item)
  );

  for (const client_id of clientIdList) {
    if (existingRecordMap[client_id]) {
      results.push(existingRecordMap[client_id]);
    } else {
      const response = await model.create({
        client_id,
        realm,
        approved_by_realm: true,
        approved_by_client: false,
      });
      results.push(response);
    }
  }
  res.status(200);
  res.send(results);
  res.end();
};

export const approveGridcontrolByRealm = async (req: any, res: any) => {
  const payload = req.body;
  const realm = req.params.realm;
  if (
    !Helper.validateGridcontrolEditPermissionForRealm(
      res,
      payload,
      realm,
      req.user.user_id
    )
  ) {
    return;
  }

  const clientIdList = payload.client_id;

  const model = getCollection(
    selfRealm,
    gridcontrolCollection,
    gridcontrolSchema
  );
  const response = await model.updateMany(
    {
      realm,
      client_id: { $in: clientIdList },
      approved_by_realm: false,
    },
    { approved_by_realm: true }
  );
  res.status(200);
  res.send(response);
  res.end();
};

export const deleteGridcontrolByRealm = async (req: any, res: any) => {
  const payload = req.body;
  const realm = req.params.realm;
  if (
    !Helper.validateGridcontrolEditPermissionForRealm(
      res,
      payload,
      realm,
      req.user.user_id
    )
  ) {
    return;
  }

  const clientIdList = payload.client_id;

  const model = getCollection(
    selfRealm,
    gridcontrolCollection,
    gridcontrolSchema
  );
  const response = await model.deleteMany({
    client_id: { $in: clientIdList },
    realm,
  });
  res.status(200);
  res.send({ message: "mapping deleted" });
  res.end();
};
