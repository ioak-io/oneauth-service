import { authorizeApi } from "../../middlewares";
import { seed } from "./service";

module.exports = function (router: any) {
  router.get("/_seed", seed);
};
