import {environment} from './environment.js';
import * as express from 'express';
import {Camembert} from 'camembert/camembert.js';
import {CamembertRouting} from 'camembert/interfaces/camembert-routing.interface.js';
import {CamembertContainer} from 'camembert/utils/camembert-container.js';

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

