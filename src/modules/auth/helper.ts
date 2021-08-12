import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import jwt from "jsonwebtoken";
import { add, addDays, differenceInSeconds } from "date-fns";

import { sessionSchema, sessionCollection } from "../session/model";
import {
  resetpasswordCollection,
  resetpasswordSchema,
} from "../resetpassword/model";
import {
  confirmemailCollection,
  confirmemailSchema,
} from "../confirmemail/model";
import { getCollection } from "../../lib/dbutils";
import { sendMail, convertMessage } from "../../lib/mailutils";
import { userCollection, userSchema } from "../user/model";

const selfRealm = 100;
const appUrl = process.env.APP_URL || "http://localhost:3010";

export const sendEmailConfirmationLink = async (
  realmId: number,
  userId: string
) => {
  const model = getCollection(realmId, userCollection, userSchema);
  const user = await model.findOne({ _id: userId });

  const confirmemailModel = getCollection(
    realmId,
    confirmemailCollection,
    confirmemailSchema
  );
  const deleteResponse = await confirmemailModel.deleteOne({
    userId: user?.id,
  });
  const code = uuidv4();
  confirmemailModel.create({
    userId: user?.id,
    code,
  });
  let link = appUrl;
  if (realmId === selfRealm) {
    link += "/#/login?type=confirmemail&auth=" + code;
  } else {
    link += "/#/realm/" + realmId + "/login?type=confirmemail&auth=" + code;
  }

  const appRoot = process.cwd();
  const emailBodyTemplate = fs.readFileSync(
    appRoot + "\\src\\emailtemplate\\ConfirmEmail.html"
  );

  const emailBody = convertMessage(emailBodyTemplate.toString(), [
    { name: "TEMPLATE_AUTH_URL", value: link },
  ]);

  sendMail({
    to: user.email,
    subject: "Oneauth confirm email",
    html: emailBody,
  });

  return { code, link };
};

export const verifyEmail = async (realmId: number, code: string) => {
  const confirmemailModel = getCollection(
    realmId,
    confirmemailCollection,
    confirmemailSchema
  );
  const link = await confirmemailModel.findOne({ code });
  if (!link) {
    return false;
  }
  const model = getCollection(realmId, userCollection, userSchema);
  const res = await model.updateOne(
    { _id: link.userId },
    { email_verified: true }
  );
  await confirmemailModel.deleteOne({ code });
  return res.nModified === 1;
};

export const createSession = async (realm: number, user: any) => {
  const session_id = uuidv4();
  const model = getCollection(realm, sessionCollection, sessionSchema);
  const claims = {
    user_id: user.id,
    given_name: user.given_name,
    family_name: user.family_name,
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    type: user.type,
  };
  const appRoot = process.cwd();
  const privateKey = fs.readFileSync(appRoot + "/private.pem");
  const refresh_token = jwt.sign(
    {
      realm,
      id: session_id,
    },
    { key: privateKey, passphrase: "no1knowsme" },
    {
      algorithm: "RS256",
      expiresIn: "8h",
    }
  );

  await model.create({
    session_id,
    refresh_token,
    user_id: user.id,
    claims,
    iat: new Date(),
    eat: add(new Date(), { hours: 8 }),
  });
  return { session_id, refresh_token };
};

export const getAccessToken = async (refreshToken: string) => {
  const decoded: any = await decodeToken(refreshToken);
  if (
    !decoded.outcome ||
    !decoded.claims ||
    !decoded.claims.realm ||
    !decoded.claims.id
  ) {
    return null;
  }
  const claims: any = decoded.claims;
  const appRoot = process.cwd();
  const privateKey = fs.readFileSync(appRoot + "/private.pem");
  const model = getCollection(claims.realm, sessionCollection, sessionSchema);
  const session = await model.findOne({ session_id: claims.id });
  if (differenceInSeconds(session.eat, new Date()) < 60) {
    return null;
  }

  const refreshTokenDuration =
    differenceInSeconds(session.eat, new Date()) > 60 * 60 * 2
      ? 60 * 60 * 2
      : differenceInSeconds(session.eat, new Date());
  const access_token = jwt.sign(
    session.claims,
    { key: privateKey, passphrase: "no1knowsme" },
    {
      algorithm: "RS256",
      expiresIn: `${refreshTokenDuration}s`,
    }
  );
  return access_token;
};

export const validateSession = async (realmId: number, sessionId: string) => {
  const model = getCollection(realmId, sessionCollection, sessionSchema);
  const session = await model.findOne({ sessionId });
  return session;
};

export const deleteSession = async (realm: number, session_id: string) => {
  const model = getCollection(realm, sessionCollection, sessionSchema);
  return await model.deleteOne({ session_id });
};

export const deleteSessionByRefreshToken = async (
  realm: number,
  refresh_token: string
) => {
  const model = getCollection(realm, sessionCollection, sessionSchema);
  return await model.deleteOne({ refresh_token });
};

export const decodeToken = async (token: string) => {
  const appRoot = process.cwd();
  const publicKey = fs.readFileSync(appRoot + "/public.pem");
  try {
    const res = await jwt.verify(token, publicKey);
    return { outcome: true, token, claims: res };
  } catch (err) {
    return { outcome: false, err };
  }
};

export const decodeSession = async (realmId: number, sessionId: string) => {
  const session: any = await validateSession(realmId, sessionId);
  if (!session) {
    return session;
  }
  return decodeToken(session.token);
};

export const getHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const resetPasswordLink = async (realmId: number, user: any) => {
  const resetPasswordModel = getCollection(
    realmId,
    resetpasswordCollection,
    resetpasswordSchema
  );
  const deleteResponse = resetPasswordModel.deleteOne({ userId: user.id });
  const resetCode = uuidv4();
  resetPasswordModel.create({
    userId: user.id,
    resetCode,
  });
  let resetLink = appUrl;
  if (realmId === selfRealm) {
    resetLink += "/#/login?type=reset&auth=" + resetCode;
  } else {
    resetLink += "/#/realm/" + realmId + "/login?type=reset&auth=" + resetCode;
  }

  const appRoot = process.cwd();
  const emailBodyTemplate = fs.readFileSync(
    appRoot + "\\src\\emailtemplate\\ResetPasswordEmailTemplate.html"
  );

  const emailBody = convertMessage(emailBodyTemplate.toString(), [
    { name: "TEMPLATE_AUTH_URL", value: resetLink },
  ]);

  sendMail({
    to: user.email,
    subject: "Oneauth reset password",
    html: emailBody,
  });

  return { resetCode, resetLink };
};

export const verifyResetCode = async (realmId: number, resetCode: string) => {
  const resetPasswordModel = getCollection(
    realmId,
    resetpasswordCollection,
    resetpasswordSchema
  );
  const res = await resetPasswordModel.findOne({ resetCode });
  return !!res;
};

export const resetPassword = async (
  realmId: number,
  resetCode: string,
  newPassword: string
) => {
  const resetPasswordModel = getCollection(
    realmId,
    resetpasswordCollection,
    resetpasswordSchema
  );
  const resetLink = await resetPasswordModel.findOne({ resetCode });

  if (!resetLink) {
    return false;
  }

  const model = getCollection(realmId, userCollection, userSchema);
  const outcome = await model.updateOne(
    { _id: resetLink.userId },
    {
      hash: await getHash(newPassword),
    }
  );

  const deleteResponse = await resetPasswordModel.deleteOne({
    _id: resetLink._id,
  });

  return true;
};
