import {environment} from './environment.js';
import * as express from 'express';
import {Camembert, CamembertRouting, CamembertContainer} from 'camembert';

import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import inflector from 'json-inflector';

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

}).then((app) => {
  app.start();
});

