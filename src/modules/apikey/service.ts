import * as Helper from "./helper";

export const getApikeys = async (req: any, res: any) => {
  const data = await Helper.getApikeys(req.params.realm);
  res.status(200);
  res.send(data);
  res.end();
};
