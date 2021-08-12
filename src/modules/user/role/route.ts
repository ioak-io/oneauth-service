import { authorizeApi } from "../../../middlewares";
import {
  getSystemPermissionForRealm,
  addSystemPermissionForRealm,
  addSystemPermissionForRealmForMultipleUsers,
  deleteSystemPermissionForRealm,
} from "./SystemPermissionRealmService";
import {
  addSystemPermissionForClient,
  addSystemPermissionForClientForMultipleUsers,
  deleteSystemPermissionForClient,
  getSystemPermissionForClient,
} from "./SystemPermissionClientService";

module.exports = function (router: any) {
  router.get(
    "/role/system/realm/:realm/user",
    authorizeApi,
    getSystemPermissionForRealm
  );
  router.post(
    "/role/system/realm/:realm/user/:user_id",
    authorizeApi,
    addSystemPermissionForRealm
  );
  router.post(
    "/role/system/realm/:realm/user",
    authorizeApi,
    addSystemPermissionForRealmForMultipleUsers
  );
  router.delete(
    "/role/system/realm/:realm/user/:user_id",
    authorizeApi,
    deleteSystemPermissionForRealm
  );
  router.get(
    "/role/system/client/:client_id/user",
    authorizeApi,
    getSystemPermissionForClient
  );
  router.post(
    "/role/system/client/:client_id/user/:user_id",
    authorizeApi,
    addSystemPermissionForClient
  );
  router.post(
    "/role/system/client/:client_id/user",
    authorizeApi,
    addSystemPermissionForClientForMultipleUsers
  );
  router.delete(
    "/role/system/client/:client_id/user/:user_id",
    authorizeApi,
    deleteSystemPermissionForClient
  );
  //   router.post("/realm", authorizeApi, createRealm);
};
