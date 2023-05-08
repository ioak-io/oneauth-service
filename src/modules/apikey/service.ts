import * as Helper from "./helper";

export const getApikeys = async (realm: number, req: any, res: any) => {
  const data = await Helper.getApikeys(realm);
  res.status(200);
  res.send(data);
  res.end();
};
