import { authorizeApi, authorizeApiKey } from "../../../middlewares";
import {
  getUserRoles,
  modifyUserRole
} from "./service";

module.exports = function (router: any) {
  router.get("/:realm/admin/permission", authorizeApiKey, (req: any, res: any) =>
    getUserRoles(req, res, req.params.realm));
  router.post("/:realm/admin/permission", authorizeApiKey, (req: any, res: any) =>
    modifyUserRole(req, res, req.params.realm));
};
