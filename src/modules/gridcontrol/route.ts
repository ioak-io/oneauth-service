import { authorizeApi } from "../../middlewares";
import * as RealmService from "./RealmService";
import * as ClientService from "./ClientService";

module.exports = function (router: any) {
  router.post(
    "/gridcontrol/realm/:realm",
    authorizeApi,
    RealmService.addGridcontrolByRealm
  );
  router.get(
    "/gridcontrol/realm/:realm",
    authorizeApi,
    RealmService.getGridcontrolByRealm
  );
  router.delete(
    "/gridcontrol/realm/:realm",
    authorizeApi,
    RealmService.deleteGridcontrolByRealm
  );
  router.post(
    "/gridcontrol/realm/:realm/approve",
    authorizeApi,
    RealmService.approveGridcontrolByRealm
  );

  router.post(
    "/gridcontrol/client/:client_id",
    authorizeApi,
    ClientService.addGridcontrolByClient
  );
  router.get(
    "/gridcontrol/client/:client_id",
    authorizeApi,
    ClientService.getGridcontrolByClient
  );
  router.delete(
    "/gridcontrol/client/:client_id",
    authorizeApi,
    ClientService.deleteGridcontrolByClient
  );
  router.post(
    "/gridcontrol/client/:client_id/approve",
    authorizeApi,
    ClientService.approveGridcontrolByClient
  );
};
