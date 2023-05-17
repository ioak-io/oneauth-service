import jwt from "jsonwebtoken";
import { decodeToken } from "./lib/authutils";
import * as ApikeyHelper from './modules/apikey/helper';

const jwtsecret = "jwtsecret";

export const authorize = (token: string) => {
  try {
    if (token) {
      return jwt.verify(token, jwtsecret);
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const authorizeApi = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.sendStatus(401);
    }
    const data = await decodeToken(token);
    if (!data.outcome) {
      return res.sendStatus(401);
    }
    console.log("-", data.claims)
    req.user = data.claims;
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
};

export const authorizeApiKey = async (req: any, res: any, next: any) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.sendStatus(401);
  }
  const data = await ApikeyHelper.getApikeyByValue(token, req.params.realm);
  if (!data) {
    return res.sendStatus(401);
  }
  next();
};
