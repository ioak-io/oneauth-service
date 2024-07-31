const express = require("express");
const router = express.Router();

router.get("/", (_: any, res: any) => {
  res.send("v1.0.0");
  res.end();
});

require("./modules/hello/route")(router);
require("./modules/auth/route")(router);
require("./modules/user/role/route")(router);
require("./modules/attributedef/route")(router);

module.exports = router;
