const expressInternal = require("express");
const routerInternal = expressInternal.Router();

routerInternal.get("/", (_: any, res: any) => {
  res.send("v1.0.0");
  res.end();
});

require("./modules/hello/route")(routerInternal);
require("./modules/apikey/route")(routerInternal);

module.exports = routerInternal;
