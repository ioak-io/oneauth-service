import { authorizeApi } from "../../middlewares";
import { getUser } from "./service";

module.exports = function (router: any) {
  router.get("/:realm/user", authorizeApi, (req: any, res: any) =>
    getUser(req, res, req.params.realm));
};
