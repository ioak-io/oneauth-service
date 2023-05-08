import { authorizeApi } from "../../../middlewares";
import {
  getUserRoles,
  modifyUserRole
} from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.get("/:realm/admin/permission", authorizeApi, (req: any, res: any) =>
    getUserRoles(req, res, req.params.realm));
  router.post("/:realm/admin/permission", authorizeApi, (req: any, res: any) =>
    modifyUserRole(req, res, req.params.realm));
};
