import { gridcontrolSchema, gridcontrolCollection } from "./model";

import { getCollection } from "../../lib/dbutils";

import * as Helper from "./helper";

const selfRealm = 100;

export const getGridcontrolByClient = async (req: any, res: any) => {
  const client_id = req.params.client_id;

  const model = getCollection(
    selfRealm,
    gridcontrolCollection,
    gridcontrolSchema
  );
  const results = await model.find({
    client_id,
  });
  res.status(200);
  res.send(results);
  res.end();
};

export const addGridcontrolByClient = async (req: any, res: any) => {
  const payload = req.body;
  const client_id = req.params.client_id;
  if (
    !Helper.validateGridcontrolEditPermissionForClient(
      res,
      payload,
      client_id,
      req.user.user_id
    )
  ) {
    return;
  }

  const realmList = payload.realm;

  const model = getCollection(
    selfRealm,
    gridcontrolCollection,
    gridcontrolSchema
  );
  const existingRecords = await model.find({
    realm: { $in: realmList },
    client_id,
  });
  const results: any = [];
  const existingRecordMap: any = {};
  existingRecords.forEach(
    (item: any) => (existingRecordMap[item.realm] = item)
  );

  for (const realm of realmList) {
    if (existingRecordMap[realm]) {
      results.push(existingRecordMap[realm]);
    } else {
      const response = await model.create({
        client_id,
        realm,
        approved_by_realm: false,
        approved_by_client: true,
      });
      results.push(response);
    }
  }
  res.status(200);
  res.send(results);
  res.end();
};

export const approveGridcontrolByClient = async (req: any, res: any) => {
  const payload = req.body;
  const client_id = req.params.client_id;
  if (
    !Helper.validateGridcontrolEditPermissionForClient(
      res,
      payload,
      client_id,
      req.user.user_id
    )
  ) {
    return;
  }

  const realmList = payload.realm;

  const model = getCollection(
    selfRealm,
    gridcontrolCollection,
    gridcontrolSchema
  );
  const response = await model.updateMany(
    {
      client_id,
      realm: { $in: realmList },
      approved_by_client: false,
    },
    { approved_by_client: true }
  );
  res.status(200);
  res.send(response);
  res.end();
};

export const deleteGridcontrolByClient = async (req: any, res: any) => {
  const payload = req.body;
  const client_id = req.params.client_id;
  if (
    !Helper.validateGridcontrolEditPermissionForClient(
      res,
      payload,
      client_id,
      req.user.user_id
    )
  ) {
    return;
  }

  const realmList = payload.realm;

  const model = getCollection(
    selfRealm,
    gridcontrolCollection,
    gridcontrolSchema
  );
  const response = await model.deleteMany({
    realm: { $in: realmList },
    client_id,
  });
  res.status(200);
  res.send({ message: "mapping deleted" });
  res.end();
};
