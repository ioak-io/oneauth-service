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
  router.post("/auth/verify-email", verifyEmail);
  router.post("/auth/authorize", signin);
  router.post("/auth/token", issueToken);
  router.get("/auth/token/decode", authorizeApi, decodeToken);
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
  router.post("/auth/oa/reset/:code/setpassword", (req: any, res: any) =>
    resetPassword(selfRealm, req, res)
  );
  router.post("/auth/oa/changepassword", authorizeApi, (req: any, res: any) =>
    changePassword(selfRealm, req, res)
  );
  // Realm endpoints
  router.get("/auth/realm/:realm/session/:id", (req: any, res: any) =>
    validateSession(req.params.realm, req, res)
  );
  router.get("/auth/realm/:realm/session/:id/decode", (req: any, res: any) =>
    decodeSession(req.params.realm, req, res)
  );
  router.delete("/auth/realm/:realm/session/:id", (req: any, res: any) =>
    deleteSession(req.params.realm, req, res)
  );
  router.post("/auth/realm/:realm/reset", (req: any, res: any) =>
    resetPasswordLink(req.params.realm, req, res)
  );
  router.post("/auth/realm/:realm/reset/:code/verify", (req: any, res: any) =>
    verifyResetCode(req.params.realm, req, res)
  );
  router.post(
    "/auth/realm/:realm/reset/:code/setpassword",
    (req: any, res: any) => resetPassword(req.params.realm, req, res)
  );
  router.post(
    "/auth/realm/:realm/changepassword",
    authorizeApi,
    (req: any, res: any) => changePassword(req.params.realm, req, res)
  );
};
