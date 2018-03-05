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
import {CamembertRouteConfig, CamembertRouteKey} from "./decorators/camembert-route.decorator";
import {CamembertRouteMiddleware} from "./middlewares/camembert-route.middleware";
import {CamembertFormKey} from "./decorators/camembert-form.decorator";


export interface CamembertRouting {
  path: string;
  httpMethod: string;
  middleware: Function[];
}


export interface CamembertRouteRouteParameter {
  name: string;
  type: any;
}

export class CamembertContainer extends Container {

}

/**
 * The Camembert core class
 */
export class Camembert {
  private started = false;

  private routes: CamembertRouting[] = [];

  private container: CamembertContainer;

  private app: express.Application;

  private routeConfigs: CamembertRouteConfig[] = [];

  /**
   *
   * @param environment
   * @param run
   */
  private constructor(private environment: CamembertEnvironment,
                      run?: (app: express.Application, routes: CamembertRouting[], container: CamembertContainer)=>void) {

    this.importControllers();

    this.setContainer();

    this.setRouting();

    this.app = express();

    if (run && typeof run === 'function') {
      run(this.app, this.routes, this.container);
    }

  }

  /**
   * Configure Camembert before start the serve
   *
   * @param environment The Camembert's configuration
   * @param run Function which will be executed to allow you to configure the app the way you want before start the server
   * @returns {Camembert}
   */
  static configure(environment: CamembertEnvironment,
                   run?: (app: express.Application, routes: CamembertRouting[], container: CamembertContainer)=>void): Camembert {

    return new this(environment, run);
  }

  /**
   * Start the server
   *
   * @param onListening Function to execute on the "listening" HTTP server event. If none a default function will be executed
   * @param onError Function to execute on the "error" HTTP server event. If none a default function will be executed
   */
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

  /**
   * Import the controllers to the app
   */
  private importControllers() {

    this.environment.controllersPath.forEach(controllerPath => {
      G.sync(controllerPath).forEach(file => {
        if (file.split('.').pop() === 'js') {
          require(file);
        }
      })
    });
  }


  /**
   * Create the DI container
   *
   */
  private setContainer() {
    this.container = new CamembertContainer();

    this.container.bind(CamembertContainer).toConstantValue(this.container);

    let targets = Reflect.getMetadata(CamembertInjectableMetadataKey, CamembertInjectable);
    targets.forEach(target => {
      this.container.bind(target).toSelf().inSingletonScope();
    });
  }

  /**
   * Set routing
   */
  private setRouting() {
    let controllers = Reflect.getMetadata(CamembertControllerMetadataKey, CamembertController);

    controllers.forEach(controller => {

      this.extractRoutesFromCamembertController(controller);
    });
  }


  /**
   * Retrieve all routes for a controller and populate the routes array
   *
   * @param controller
   */
  private extractRoutesFromCamembertController(controller: Function) {


    for (let actionName of Object.getOwnPropertyNames(controller.prototype)) {
      let action = controller.prototype[actionName];

      if (typeof action !== 'function') {
        continue;
      }

      let route: CamembertRouteConfig = Reflect.getMetadata(CamembertRouteKey, action);

      if (!route) {
        continue;
      }

      route.path = (Reflect.getMetadata(CamembertControllerMetadataKey, controller) || "") + route.path;

      this.routeConfigs.push(route);

      let controllerInstance = this.container.get(route.controller.constructor);

      let routeParams = CamembertUtils.getRouteParameters(controllerInstance, route.action);


      let middleware: Function[] = route.beforeMiddleware ? route.beforeMiddleware : [];

      for (let routerParam of routeParams) {
        if (typeof routerParam.type === 'function') {

          let formValidator = Reflect.getMetadata(CamembertFormKey, routerParam.type);

          if (formValidator) {

            middleware.push((req, res, next) => {

              let formInst = new routerParam.type();

              for (let property of Object.keys(formInst)) {
                if (req.body.hasOwnProperty(property)) {
                  formInst[property] = req.body[property];
                }
              }
              formValidator(req, res, next, formInst);
            });
          }
        }
      }


      middleware.push(CamembertRouteMiddleware(controllerInstance, route.action, routeParams));

      route.afterMiddleware.forEach(m => {
        middleware.push(m);
      });

      this.routes.push(
        {
          path: route.path,
          httpMethod: route.httpMethod,
          middleware: middleware,
        }
      );
    }
  }

  /**
   * Event listener for HTTP server "error" event
   *
   * @param error
   */
  private onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }

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


  /**
   * Dump the routes into the console
   *
   * @param app
   */
  private dumpRoutes(app: express.Application) {
    let ignoredRoutes = ['query', 'expressInit'];

    if(this.environment.verbose !== false) {
      console.log(`------ ROUTES ------`);
    }
    app._router.stack.forEach(entry => {

      if (entry.route) {
        let route = entry.route;
        Object.keys(route.methods)
          .filter((method) => {
            return !!route.methods[method]
          })
          .map((method) => {
            let r = method.toUpperCase() + ' ' + route.path;

            this.routeConfigs.forEach((route: CamembertRouteConfig) => {
              let paramNames: string[] = [];
              let controllerInstance = this.container.get(route.controller.constructor);
              let routeParams = CamembertUtils.getRouteParameters(controllerInstance, route.action);
              for (let param of routeParams) {
                paramNames.push(param.name + ':' + param.type.name);
              }


              if (r === route.httpMethod.toUpperCase() + ' ' + route.path) {
                r += ' → ' + route.controller.constructor.name + '::' + route.action.name + '(' + paramNames.join(', ') + ')';
              }
            });

            if(this.environment.verbose !== false) {
              console.log(r);
            }
          })
      }
    });

    if(this.environment.verbose !== false) {
      console.log(`------ ${this.routeConfigs.length} routes found ------`);
    }
  }

}


/**
 * CamembertUtils class
 */
export class CamembertUtils {

  /**
   * Retrieve route parameters
   *
   * @param ControllerInstance
   * @param method
   * @returns {CamembertRouteRouteParameter[]}
   */
  static getRouteParameters(ControllerInstance, method): CamembertRouteRouteParameter[] {

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

    let parameters = getParamNames(method);
    let parameterTypes = Reflect.getMetadata('design:paramtypes', ControllerInstance, method.name);

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
