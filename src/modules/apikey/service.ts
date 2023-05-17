import * as Helper from "./helper";

export const getApikeys = async (req: any, res: any) => {
  const data = await Helper.getApikeys(req.params.realm);
  res.status(200);
  res.send(data);
  res.end();
};

export const addApikey = async (req: any, res: any) => {
  const data = await Helper.addApiKey(req.params.realm);
  res.status(200);
  res.send(data);
  res.end();
};


export const deleteApikey = async (req: any, res: any) => {
  const data = await Helper.deleteApiKey(req.params.token, req.params.realm);
  res.status(200);
  res.send(data);
  res.end();
};
