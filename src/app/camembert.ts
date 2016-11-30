import "reflect-metadata";
import {Container} from "inversify";
import * as express from "express";
import * as http from 'http';
import {
  CamembertInjectable,
  CamembertInjectableMetadataKey
} from "./decorators/camembert-injectable.decorator";


import G = require("glob");

import {CamembertEnvironment} from "./interfaces/camembert-environment.interface";
import {CamembertControllerMetadataKey, CamembertController} from "./decorators/camembert-controller.decorator";
import {CamembertRouteConfig} from "./decorators/camembert-route.decorator";

export interface CamembertRoute {
  controllerInstance: Function;
  path: string;
  httpMethod: string;
  middleware: Function;
  data: any;
}


export interface CamembertRouteRouteParameter {
  name: string;
  type: any;
}


export class Camembert {
  private started = false;

  private routes: CamembertRoute[] = [];

  private container: Container;

  private app: express.Application;

  private constructor(private environment: CamembertEnvironment,
                      run?: (app: express.Application, routes: CamembertRoute[], container: Container)=>void) {

    this.importControllers();

    this.setContainer();

    this.setRouting();

    this.app = express();

    if (run && typeof run === 'function') {
      run(this.app, this.routes, this.container);
    }

  }

  static configure(environment: CamembertEnvironment,
                   run?: (app: express.Application, routes: CamembertRoute[], container: Container)=>void): Camembert {

    return new this(environment, run);
  }

  start(onListening?: (server: http.Server)=>void, onError?: (server: http.Server, error: any)=>void) {
    if (this.started) {
      throw 'Server already started';
    }

    let server = http.createServer(this.app);

    server.listen(this.environment.port);

    this.started = true;

    server.on('listening', () => {
      if (onListening && typeof onListening === 'function') {
        onListening(server);
      } else {
        this.onListening(server);
      }

      this.dumpRoutes(this.app);
    });

    server.on('error', (error) => {
      if (onError && typeof onError === 'function') {
        onError(server, error);
      } else {
        this.onError(error);
      }
    });
  }

  private importControllers() {

    this.environment.controllersPath.forEach(controllerPath => {
      G.sync(controllerPath).forEach(file => {
        if (file.split('.').pop() === 'js') {
          require(file);
        }
      })
    });
  }


  private setContainer() {
    this.container = new Container();

    this.container.bind(this.container.constructor).toSelf().inSingletonScope();

    let targets = Reflect.getMetadata(CamembertInjectableMetadataKey, CamembertInjectable);
    targets.forEach(target => {
      this.container.bind(target).toSelf().inSingletonScope();
    });
  }


  private setRouting() {
    let controllers = Reflect.getMetadata(CamembertControllerMetadataKey, CamembertController);

    controllers.forEach(controller => {

      this.extractRoutesFromCamembertController(controller);
    });
  }

  private extractRoutesFromCamembertController(controller: Function) {

    for (let actionName of Object.getOwnPropertyNames(controller.prototype)) {
      let action = controller.prototype[actionName];

      if (typeof action !== 'function' || !Reflect.hasMetadata('routes', action)) {
        continue;
      }

      let routes = Reflect.getMetadata('routes', action);

      routes.forEach((route: CamembertRouteConfig) => {

        let camembertRoute: CamembertRoute = {
          controllerInstance: this.container.get(route.controller.constructor),
          path: (Reflect.getMetadata(CamembertControllerMetadataKey, controller) || "") + route.path,
          httpMethod: route.httpMethod,
          middleware: route.middleware,
          data: route.data,
        };


        this.routes.push(camembertRoute);

      });
    }
  }


  private onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`Port ${this.environment.port} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`Port ${this.environment.port} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  private onListening(server: http.Server) {

    let addr = server.address();

    let bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;

    console.log('Server started on ' + bind);
  }


  private dumpRoutes(app) {
    let ignoredRoutes = ['query', 'expressInit'];

    console.log('------ ROUTES ------');
    app._router.stack.forEach(entry => {

      if (entry.route) {
        let route = entry.route;
        Object.keys(route.methods)
          .filter((method) => {
            return !!route.methods[method]
          })
          .map((method) => {
            let r = method.toUpperCase() + ' ' + route.path;


            this.routes.forEach((route: CamembertRoute) => {
              let paramNames: string[] = [];
              let routeParams = CamembertUtils.getRouteParameters(route);
              for (let param of routeParams) {
                paramNames.push(param.name + ':' + param.type.name);
              }
              if (r === route.httpMethod.toUpperCase() + ' ' + route.path) {
                r += ' → ' + route.controllerInstance.constructor.name + '::' + route.middleware.name + '(' + paramNames.join(', ') + ')';
              }
            });

            console.log(r);
          })
      }
    });
  }

}


export class CamembertUtils {

  static getRouteParameters(route: CamembertRoute): CamembertRouteRouteParameter[] {

    let routeParams: CamembertRouteRouteParameter[] = [];

    let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    let ARGUMENT_NAMES = /([^\s,]+)/g;

    function getParamNames(func) {
      let fnStr = func.toString().replace(STRIP_COMMENTS, '');
      let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      if (result === null)
        result = [];
      return result;
    }

    let parameters = getParamNames(route.middleware);
    let parameterTypes = Reflect.getMetadata('design:paramtypes', route.controllerInstance, route.middleware.name);

    parameters.forEach((parameter, i) => {
      if (parameterTypes.hasOwnProperty(i)) {
        routeParams.push({
          name: parameter,
          type: parameterTypes[i]
        });
      }
    });


    return routeParams;
  }
}
