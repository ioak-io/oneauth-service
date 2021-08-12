import { authorizeApi } from "../../middlewares";
import { getClients, createClient, updateClient, getClient } from "./service";

module.exports = function (router: any) {
  router.get("/client", authorizeApi, getClients);
  router.get("/client/:client_id", getClient);
  router.put("/client/:client_id", authorizeApi, updateClient);
  router.post("/client", authorizeApi, createClient);
};
