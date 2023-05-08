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
  router.post("/:realm/user/auth/signup", (req: any, res: any) =>
    signup(req, res, req.params.realm));
  router.post("/:realm/user/auth/verify-email/resend", (req: any, res: any) =>
    emailVerificationLink(req, res, req.params.realm));
  router.post("/:realm/user/auth/verify-email/:code", (req: any, res: any) =>
    verifyEmail(req, res, req.params.realm));
  router.post("/:realm/user/auth/signin", (req: any, res: any) =>
    signin(req, res, req.params.realm));
  router.post("/:realm/user/auth/token", (req: any, res: any) =>
    issueToken(req, res, req.params.realm));
  router.get("/:realm/user/auth/token/decode", authorizeApi, (req: any, res: any) =>
    decodeToken(req, res));
  router.post("/:realm/user/auth/reset-password-link", (req: any, res: any) =>
    resetPasswordLink(req, res, req.params.realm)
  );
  router.post("/:realm/user/auth/reset-password/:code", (req: any, res: any) =>
    resetPassword(req, res, req.params.realm)
  );
  router.post("/:realm/user/auth/change-password", authorizeApi, (req: any, res: any) =>
    changePassword(req, res, req.params.realm)
  );


  router.post("/auth/logout", logout);
  router.get("/auth/oa/session/:id", (req: any, res: any) =>
    validateSession(selfRealm, req, res)
  );
  router.delete("/auth/oa/session/:id", (req: any, res: any) =>
    deleteSession(selfRealm, req, res)
  );
  router.get("/auth/oa/session/:id/decode", (req: any, res: any) =>
    decodeSession(req, res)
  );
  router.post("/auth/oa/reset", (req: any, res: any) =>
    resetPasswordLink(selfRealm, req, res)
  );
  router.post("/auth/oa/reset/:code/verify", (req: any, res: any) =>
    verifyResetCode(selfRealm, req, res)
  );
};
