import { authorizeApi } from "../../middlewares";
import {
  signin,
  signup,
  issueToken,
  decodeToken,
  logout,
  validateSession,
  deleteSession,
  decodeSession,
  resetPasswordLink,
  verifyResetCode,
  resetPassword,
  changePassword,
  verifyEmail,
  emailVerificationLink,
} from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.post("/:realm/auth/signup", (req: any, res: any) =>
    signup(req.params.realm, req, res));
  router.post("/:realm/auth/verify-email/resend", (req: any, res: any) =>
    emailVerificationLink(req.params.realm, req, res));
  router.post("/:realm/auth/verify-email/:code", (req: any, res: any) =>
    verifyEmail(req.params.realm, req, res));
  router.post("/:realm/auth/signin", (req: any, res: any) =>
    signin(req.params.realm, req, res));
  router.post("/:realm/auth/token", (req: any, res: any) =>
    issueToken(req.params.realm, req, res));
  router.get("/:realm/auth/token/decode", authorizeApi, (req: any, res: any) =>
    decodeToken(req.params.realm, req, res));
  router.post("/:realm/auth/reset-password-link", (req: any, res: any) =>
    resetPasswordLink(req.params.realm, req, res)
  );
  router.post("/:realm/auth/reset-password/:code", (req: any, res: any) =>
    resetPassword(req.params.realm, req, res)
  );
  router.post("/:realm/auth/change-password", authorizeApi, (req: any, res: any) =>
    changePassword(req.params.realm, req, res)
  );


  router.post("/auth/logout", logout);
  router.get("/auth/oa/session/:id", (req: any, res: any) =>
    validateSession(selfRealm, req, res)
  );
  router.delete("/auth/oa/session/:id", (req: any, res: any) =>
    deleteSession(selfRealm, req, res)
  );
  router.get("/auth/oa/session/:id/decode", (req: any, res: any) =>
    decodeSession(selfRealm, req, res)
  );
  router.post("/auth/oa/reset", (req: any, res: any) =>
    resetPasswordLink(selfRealm, req, res)
  );
  router.post("/auth/oa/reset/:code/verify", (req: any, res: any) =>
    verifyResetCode(selfRealm, req, res)
  );
};
