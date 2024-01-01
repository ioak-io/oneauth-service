if (module.hot) {
  module.hot.accept();
  // module.hot.dispose(() => server.stop());
}

import { authorize, authorizeApi } from "./middlewares";
import mongoose from "mongoose";
import { initializeSequences } from "./startup";
import { apiDocumentation } from "./docs/apidoc";
const express = require("express");
const cors = require("cors");
// const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var ApiRoute = require("./route");
var InternalApiRoute = require("./route_internal");

const databaseUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

mongoose.connect(databaseUri, {
});
mongoose.pluralize(undefined);

const app = express();

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiDocumentation));

app.use(cors());

app.use(express.json({ limit: 5000000 }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/api", ApiRoute);
app.use("/api-internal", InternalApiRoute);

app.use((_: any, res: any) => {
  res.status(404);
  res.send("Not found");
  res.end();
});

app.listen({ port: process.env.PORT || 4010 }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT || 4010}`
  )
);

// server
//   .listen({ port: process.env.PORT || 4000 })
//   .then(({ url }: any) => console.log(`Server started at ${url}`));

// Server startup scripts
initializeSequences();
