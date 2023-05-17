import * as Helper from "./helper";

const selfRealm = 100;

export const deleteRole = async (req: any, res: any) => {
  const response: any = await Helper.deleteRole(req.params.id, req.params.realm);
  res.status(200);
  res.send(response);
  res.end();
};

export const getRoles = async (req: any, res: any) => {
  const data: any = await Helper.getRoles(req.params.realm);
  res.status(200);
  res.send(data);
  res.end();
};

export const addRole = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const data: any = await Helper.addRole(req.params.name, req.params.realm);
  res.status(200);
  res.send(data);
  res.end();
};
