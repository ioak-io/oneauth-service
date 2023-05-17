import { authorizeApi } from "../../middlewares";
import { getApikeys, addApikey, deleteApikey } from "./service";

module.exports = function (router: any) {
  router.get("/:realm/apikey", authorizeApi, getApikeys);
  router.post("/:realm/apikey", authorizeApi, addApikey);
  router.delete("/:realm/apikey/:token", authorizeApi, deleteApikey);
};
