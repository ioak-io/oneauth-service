import { validateMandatoryFields } from "../../lib/validation";
import { userSchema, userCollection } from "./model";

import { getCollection } from "../../lib/dbutils";

const selfRealm = 100;

export const getUser = async (req: any, res: any, realm?: number) => {
  const model = getCollection(userCollection, userSchema, realm);
  const users = await model.find({});
  res.status(200);
  res.send(users);
  res.end();
};
