import { v4 as uuid } from "uuid";
import { clientSchema, clientCollection } from "../client/model";
import { getCollection } from "../../lib/dbutils";

import * as RealmHelper from "../realm/helper";

const selfRealm = 100;

export const seed = async (req: any, res: any) => {
  const model = getCollection(selfRealm, clientCollection, clientSchema);
  // const realm = await RealmHelper.generateRealmNumber();
  const existingRecord = await model.findOne({ name: "__oneauth_admin__" });
  if (!existingRecord) {
    const client_id = uuid();
    const outcome = await model.create({
      client_id,
      name: "__oneauth_admin__",
      description: "Admin group for oneauth system",
    });
  }
  res.status(200);
  // res.send(clients);
  res.end();
};
