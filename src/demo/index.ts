import {environment} from "./environment";
import * as express from "express";
import morgan = require("morgan");
import helmet = require("helmet");
import bodyParser = require("body-parser");
import {Container} from "inversify";
let inflector = require("json-inflector");
import {Camembert, CamembertRoute} from "../app/camembert";
import {CamembertRouteMiddleware} from "../app/middlewares/camembert-route.middleware";


Camembert.configure(environment, (app: express.Application, routes: CamembertRoute[], container: Container) => {

  //My middleware
  app.use(morgan('combined'));

  app.use(helmet());

  app.use(bodyParser.json());

  app.use(inflector({
    request: 'camelizeLower',
    response: 'underscore'
  }));

  //Register routes
  routes.forEach((route) => {
    app[route.httpMethod](route.path, CamembertRouteMiddleware(route).bind(route.controllerInstance));
  });

  //Route without camembert decorators
  app.get('/not/camembert/:id', (req, res, next) => {
    res.send('NOT CAMEMBERT');
  })

}).start();
