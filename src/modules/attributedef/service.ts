import * as Helper from "./helper";

const selfRealm = 100;

export const updateAttributedef = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const attributedef: any = await Helper.updateAttributedef(req.params.space, req.body, userId);
  res.status(200);
  res.send(attributedef);
  res.end();
};

export const getAttributedef = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const attributedefList: any = await Helper.getAttributedef(req.params.space);
  res.status(200);
  res.send(attributedefList);
  res.end();
};


export const deleteAttributedef = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const outcome: any = await Helper.deleteAttributedef(req.params.space, req.params.id);
  res.status(200);
  res.send(outcome);
  res.end();
};
