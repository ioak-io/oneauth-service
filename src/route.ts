const express = require("express");
const router = express.Router();

router.get("/", (_: any, res: any) => {
  res.send("v1.0.0");
  res.end();
});

require("./modules/hello/route")(router);
require("./modules/_seed/route")(router);
require("./modules/auth/route")(router);
require("./modules/realm/route")(router);
require("./modules/client/route")(router);
require("./modules/role/client/route")(router);
require("./modules/gridcontrol/route")(router);
require("./modules/role/system/route")(router);
require("./modules/user/role/route")(router);
require("./modules/user/route")(router);

module.exports = router;
