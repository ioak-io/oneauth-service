import { authorizeApi } from "../../middlewares";
import { getApikeys } from "./service";

module.exports = function (router: any) {
  router.get("/:realm/apikey", authorizeApi, getApikeys);
};
