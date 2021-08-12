import { validateMandatoryFields } from "../../lib/validation";
import { userSchema, userCollection } from "./model";

import { getCollection } from "../../lib/dbutils";

const selfRealm = 100;

export const getSystemUsers = async (req: any, res: any) => {
  const model = getCollection(selfRealm, userCollection, userSchema);
  const users = await model.find({});
  res.status(200);
  res.send(users);
  res.end();
};
