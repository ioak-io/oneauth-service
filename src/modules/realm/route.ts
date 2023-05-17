import { authorizeApi } from "../../middlewares";
import {
  getRealms,
  createRealm,
  updateRealm,
  getRealm,
  introspect,
} from "./service";

module.exports = function (router: any) {
  router.get("/realm", authorizeApi, getRealms);
  router.post("/realm", authorizeApi, createRealm);
  router.put("/realm/:realm", authorizeApi, updateRealm);

  router.get("/realm/introspect", introspect);
  router.get("/realm/:realm", getRealm);
};
