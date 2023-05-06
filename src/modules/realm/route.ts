import { authorizeApi } from "../../middlewares";
import {
  getRealms,
  createRealm,
  updateRealm,
  getRealm,
  introspect,
} from "./service";

module.exports = function (router: any) {

  /**
 * @swagger
 *    components:
 *      schemas:
 *        Book:
 *          type: object
 *          required:
 *            - title
 *            - author
 *            - finished
 *          properties:
 *            id:
 *              type: integer
 *              description: The auto-generated id of the book.
 *            title:
 *              type: string
 *              description: The title of your book.
 */
  router.get("/realm", authorizeApi, getRealms);

  router.get("/realm/introspect", introspect);
  router.get("/realm/:realm", getRealm);
  router.put("/realm/:realm", authorizeApi, updateRealm);
  router.post("/realm", authorizeApi, createRealm);
};
