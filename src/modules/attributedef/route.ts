import { asyncHandler } from "../../handler";
import { authorizeApi } from "../../middlewares";
import {
  updateAttributedef,
  getAttributedef,
  deleteAttributedef,
} from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.post(
    "/attributedef/:space/full",
    authorizeApi,
    asyncHandler(updateAttributedef)
  );
  router.get(
    "/attributedef/:space",
    authorizeApi,
    asyncHandler(getAttributedef)
  );
  router.delete(
    "/attributedef/:space/:id",
    authorizeApi,
    asyncHandler(deleteAttributedef)
  );
};
