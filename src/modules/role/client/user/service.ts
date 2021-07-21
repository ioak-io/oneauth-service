import { getCollection } from "../../../../lib/dbutils";

const selfRealm = 100;

export const getRealms = async (req: any, res: any) => {
  res.status(200);
  // res.send(realms);
  res.end();
};
