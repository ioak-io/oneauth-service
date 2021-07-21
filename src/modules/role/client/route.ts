import { authorizeApi } from "../../../middlewares";
import { createClientRole, getClientRoles } from "./service";

module.exports = function (router: any) {
  router.get("/client/:client_id/role", authorizeApi, getClientRoles);
  router.post("/client/:client_id/role", authorizeApi, createClientRole);
};
