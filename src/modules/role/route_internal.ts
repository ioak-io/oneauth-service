import { authorizeApi } from "../../middlewares";
import {
  getRoles,
  addRole,
  deleteRole
} from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.get("/:realm/role", authorizeApi, getRoles);
  router.post("/:realm/role/:name", authorizeApi, addRole);
  router.delete("/:realm/role/:id", authorizeApi, deleteRole);
};
