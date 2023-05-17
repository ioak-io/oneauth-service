import { authorizeApi, authorizeApiKey } from "../../../middlewares";
import {
  getUserRoles,
  modifyUserRole
} from "./service";

module.exports = function (router: any) {
  router.get("/permission", authorizeApi, (req: any, res: any) =>
    getUserRoles(req, res));
  router.post("/permission", authorizeApi, (req: any, res: any) =>
    modifyUserRole(req, res));
};
