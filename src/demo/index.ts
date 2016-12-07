import {environment} from "./environment";
import * as express from "express";
import morgan = require("morgan");
import helmet = require("helmet");
import bodyParser = require("body-parser");
let inflector = require("json-inflector");
import {Camembert, CamembertRouting, CamembertContainer} from "../app/camembert";


Camembert.configure(environment, (app: express.Application, routes: CamembertRouting[], container: CamembertContainer) => {

  //Register you own middleware here
  app.use(morgan('combined'));

  app.use(helmet());

  app.use(bodyParser.json());

  app.use(inflector({
    request: 'camelizeLower',
    response: 'underscore'
  }));


  //Register the routes
  routes.forEach((route) => {
    app[route.httpMethod](route.path, route.middleware);
  });

}).start();
