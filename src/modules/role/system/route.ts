import { authorizeApi } from "../../../middlewares";
import { getAllRoles } from "./service";

module.exports = function (router: any) {
  router.get("/role/system", authorizeApi, getAllRoles);
};
