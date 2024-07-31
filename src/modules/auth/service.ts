import bcrypt from "bcrypt";
import { validateMandatoryFields } from "../../lib/validation";

import { userSchema, userCollection } from "../user/model";
import * as Helper from "./helper";
import * as UserRoleHelper from "../user/role/helper";
import { getCollection } from "../../lib/dbutils";

const selfRealm = 100;

export const signup = async (req: any, res: any, realm?: number) => {
  const payload = req.body;
  if (
    !validateMandatoryFields(res, payload, [
      "email",
      "password",
      "given_name",
      "family_name",
    ])
  ) {
    return;
  }
  const model = getCollection(userCollection, userSchema, realm);
  const user = await model.findOne({ email: payload.email.toLowerCase() });
  if (user) {
    res.status(403);
    res.send({ error: { message: "User with same email already exists" } });
    res.end();
    return;
  }
  const userData = {
    email: payload.email.toLowerCase(),
    given_name: payload.given_name,
    family_name: payload.family_name,
    name: payload.name || `${payload.given_name} ${payload.family_name}`,
    nickname: payload.nickname || payload.given_name,
    picture: payload.picture,
    email_verified: false,
    metadata: payload.metadata || {},
    type: "oneauth",
    hash: await Helper.getHash(payload.password),
  };
  const outcome = await model.create(userData);
  Helper.sendEmailConfirmationLink(outcome._id, realm);
  res.status(200);
  res.send(outcome);
  res.end();
};

export const getUserList = async (req: any, res: any, realm?: number) => {
  const data = await Helper.getUserList(realm);
  res.status(200);
  res.send(data);
  res.end();
};

export const getPermissions = async (req: any, res: any, realm?: number) => {
  console.log(req.user);
  const userId = req.user.user_id;
  const data = await Helper.getPermissions(userId, realm);
  res.status(200);
  res.send(data);
  res.end();
};

export const emailVerificationLink = async (
  req: any,
  res: any,
  realm?: number
) => {
  const payload = req.body;
  if (!validateMandatoryFields(res, payload, ["email"])) {
    return;
  }
  const email = req.body.email;
  const model = getCollection(userCollection, userSchema, realm);
  const user: any = await model.findOne({
    email: payload.email.toLowerCase(),
    type: "oneauth",
  });
  if (!user) {
    res.status(404);
    res.send({ error: { message: "User with this user name does not exist" } });
    res.end();
    return;
  }
  if (!user.email_verified) {
    const outcome = await Helper.sendEmailConfirmationLink(user._id, realm);
    res.status(200);
    res.send(outcome);
    res.end();
    return;
  }
  res.status(200);
  res.send({ message: "Email already verified" });
  res.end();
};

export const verifyEmail = async (req: any, res: any, realm?: number) => {
  const outcome = await Helper.verifyEmail(req.params.code, realm);
  if (!outcome) {
    res.status(404);
    res.send({ error: { message: "Invalid verification link" } });
    res.end();
    return;
  }
  res.status(200);
  res.send({
    message: "Email successfully verified",
  });
  res.end();
};

export const signin = async (req: any, res: any, realm?: number) => {
  const payload = req.body;
  if (
    !validateMandatoryFields(res, payload, [
      "email",
      "password",
      "response_type",
    ])
  ) {
    return;
  }
  const model = getCollection(userCollection, userSchema, realm);
  const user: any = await model.findOne({
    email: payload.email.toLowerCase(),
    type: "oneauth",
  });
  if (!user) {
    res.status(404);
    res.send({ error: { message: "User with this user name does not exist" } });
    res.end();
    return;
  }
  if (!user.email_verified) {
    res.status(403);
    res.send({ error: { message: "Email of user not verified" } });
    res.end();
    return;
  }

  const outcome = await bcrypt.compare(payload.password, user.hash);
  if (!outcome) {
    res.status(401);
    res.send({ error: { message: "Incorrect password" } });
    res.end();
    return;
  }

  const { session_id, refresh_token } = await Helper.createSession(user, realm);

  if (payload.response_type === "code") {
    res.status(200);
    res.send({ session_id });
    res.end();
    return;
  }
  res.status(200);
  const access_token: any = await Helper.getAccessToken(refresh_token, realm);
  const decodedToken = await Helper.decodeToken(access_token);
  res.send({
    token_type: "Bearer",
    access_token,
    refresh_token,
    claims: decodedToken?.claims,
    permissions: await Helper.getPermissions(user._id, realm),
  });
  res.end();
};

export const issueToken = async (req: any, res: any, realm?: number) => {
  const payload = req.body;
  if (!validateMandatoryFields(res, payload, ["grant_type", "refresh_token"])) {
    return;
  }

  if (payload.grant_type === "refresh_token") {
    const access_token = await Helper.getAccessToken(
      payload.refresh_token,
      realm
    );
    if (!access_token) {
      res.status(400);
      res.send({ error: { message: "Refresh token invalid or expired" } });
      res.end();
      return;
    }
    const decodedToken = await Helper.decodeToken(access_token);
    const permissions = await Helper.getPermissions(
      decodedToken?.claims?.user_id,
      realm
    );
    res.status(200);
    res.send({
      token_type: "Bearer",
      access_token,
      claims: decodedToken.claims,
      permissions,
    });
    res.end();
    return;
  }

  const token = req.params.token;
  const outcome = await Helper.decodeToken(token);
  res.status(200);
  res.send(outcome);
  res.end();
};

export const logout = async (req: any, res: any) => {
  const payload = req.body;
  if (!validateMandatoryFields(res, payload, ["realm", "refresh_token"])) {
    return;
  }
  const outcome = await Helper.deleteSessionByRefreshToken(
    payload.realm,
    payload.refresh_token
  );
  if (outcome.deletedCount === 0) {
    res.status(404);
    res.send({ error: { message: "Invalid session" } });
    res.end();
    return;
  }
  res.status(200);
  res.send({ refresh_token: payload.refresh_token });
  res.end();
};

export const validateSession = async (realm: number, req: any, res: any) => {
  const session: any = await Helper.validateSession(realm, req.params.id);
  if (!session) {
    res.status(404);
    res.send("Session not found");
    res.end();
    return;
  }
  res.status(200);
  res.send({ sessionId: req.params.id, token: session.token });
  res.end();
};

export const deleteSession = async (realm: number, req: any, res: any) => {
  const outcome = await Helper.deleteSession(selfRealm, req.params.id);
  if (outcome.deletedCount === 0) {
    res.status(404);
    res.send("Session not found");
    res.end();
    return;
  }
  res.status(200);
  res.send({ sessionId: req.params.id });
  res.end();
};

export const decodeToken = async (req: any, res: any) => {
  res.status(200);
  res.send({ ...req.user });
  res.end();
};

export const decodeSession = async (req: any, res: any) => {
  const outcome = await Helper.decodeSession(selfRealm, req.params.id);
  if (!outcome) {
    res.status(404);
    res.send("Session not found");
    res.end();
    return;
  }
  res.status(200);
  res.send(outcome);
  res.end();
};

export const resetPasswordLink = async (req: any, res: any, realm?: number) => {
  const payload = req.body;
  if (!validateMandatoryFields(res, payload, ["email"])) {
    return;
  }
  const model = getCollection(userCollection, userSchema, realm);
  const user = await model.findOne({
    email: payload.email.toLowerCase(),
    email_verified: true,
  });
  if (!user) {
    res.status(404);
    res.send({ error: { message: "User with this user name does not exist" } });
    res.end();
    return;
  }
  const { resetCode, resetLink } = await Helper.resetPasswordLink(user, realm);
  res.status(200);
  res.send({ resetCode, resetLink });
  res.end();
};

export const verifyResetCode = async (req: any, res: any, realm?: number) => {
  const outcome = await Helper.verifyResetCode(req.params.code, realm);
  res.status(200);
  res.send({ outcome });
  res.end();
};

export const resetPassword = async (req: any, res: any, realm?: number) => {
  const payload = req.body;
  if (!validateMandatoryFields(res, payload, ["password"])) {
    return;
  }
  const outcome = await Helper.resetPassword(
    req.params.code,
    payload.password,
    realm
  );
  if (!outcome) {
    res.status(404);
    res.send({ error: { message: "Invalid password reset link" } });
    res.end();
    return;
  }
  res.status(200);
  res.send({
    message: "Password updated",
  });
  res.end();
};

export const changePassword = async (req: any, res: any, realm?: number) => {
  const payload = req.body;
  if (!validateMandatoryFields(res, payload, ["oldPassword", "newPassword"])) {
    return;
  }
  const model = getCollection(userCollection, userSchema, realm);
  const user: any = await model.findOne({ _id: req.user.user_id });
  if (!user) {
    res.status(404);
    res.end();
    return;
  }
  const verificationStatus = await bcrypt.compare(
    payload.oldPassword,
    user.hash
  );
  if (!verificationStatus) {
    res.status(401);
    res.send("Existing password is incorrect");
    res.end();
    return;
  }
  const outcome = await model.updateOne(
    { _id: user._id },
    {
      hash: await Helper.getHash(payload.newPassword),
    }
  );

  res.status(200);
  res.send("Password updated");
  res.end();
};

export const updateProfile = async (req: any, res: any, realm?: number) => {
  const payload = req.body;
  const model = getCollection(userCollection, userSchema, realm);
  const user: any = await model.findOne({ _id: req.user.user_id });
  if (!user) {
    res.status(404);
    res.end();
    return;
  }
  const {
    _id,
    id,
    email,
    name,
    email_verified,
    type,
    hash,
    createdAt,
    updatedAt,
    ...updatedValues
  }: any = { ...payload };
  const outcome = await model.updateOne({ _id: user._id }, updatedValues);

  res.status(200);
  res.send(Object.keys(updatedValues));
  res.end();
};
