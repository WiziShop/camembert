import "reflect-metadata";
import * as http from 'http';
import {
  CamembertInjectable,
  CamembertInjectableMetadataKey
} from "./decorators/camembert-injectable.decorator.js";

import {CamembertEnvironment} from "./interfaces/camembert-environment.interface.js";
import {CamembertControllerMetadataKey, CamembertController} from "./decorators/camembert-controller.decorator.js";
import {CamembertRouteKey} from "./decorators/camembert-route.decorator.js";
import {CamembertRouteMiddleware} from "./middlewares/camembert-route.middleware.js";
import {CamembertFormKey} from "./decorators/camembert-form.decorator.js";
import express from "express";
import { CamembertRouteConfig } from "./interfaces/camembert-route-config.interface.js";
import { CamembertContainer } from "./utils/camembert-container.js";
import { CamembertUtils } from "./utils/camembert-utils.js";
import { CamembertRouting } from "./interfaces/camembert-routing.interface.js";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const G = require('glob');

/**
 * The Camembert core class
 */
export class Camembert {
  private started = false;

  private route_imported = false;

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

    this.importControllers().then(() => {
      this.setContainer();

      this.setRouting();

      this.app = express();

      if (run && typeof run === 'function') {
        run(this.app, this.routes, this.container);
      }

      this.route_imported = true;
    });
  }

  /**
   * Configure Camembert before start the serve
   *
   * @param environment The Camembert's configuration
   * @param run Function which will be executed to allow you to configure the app the way you want before start the server
   * @returns {Camembert}
   */
  static async configure(environment: CamembertEnvironment,
                   run?: (app: express.Application, routes: CamembertRouting[], container: CamembertContainer)=>void): Promise<Camembert> {
    const camembert = new this(environment, run);

    return new Promise((resolve) => {
      setTimeout(() => {
        if (camembert.route_imported) {
          resolve(camembert);
        }
      }, 100);
    });
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

    const server = http.createServer(this.app);

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
  private async importControllers() {

    return new Promise((resolve) => {
      const fileImport = [];
      this.environment.controllersPath.forEach(controllerPath => {
        G.sync(controllerPath).forEach(async file => {
          if (file.split('.').pop() === 'js') {
            fileImport.push(import(file));
          }
        })
      });
      Promise.all(fileImport).then(() => {
        resolve(true);
      });
    });

  }


  /**
   * Create the DI container
   *
   */
  private setContainer() {
    this.container = new CamembertContainer();

    this.container.bind(CamembertContainer).toConstantValue(this.container);

    const targets = Reflect.getMetadata(CamembertInjectableMetadataKey, CamembertInjectable);
    targets.forEach(target => {
      this.container.bind(target).toSelf().inSingletonScope();
    });
  }

  /**
   * Set routing
   */
  private setRouting() {
    const controllers = Reflect.getMetadata(CamembertControllerMetadataKey, CamembertController);

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


    for (const actionName of Object.getOwnPropertyNames(controller.prototype)) {
      const action = controller.prototype[actionName];

      if (typeof action !== 'function') {
        continue;
      }

      const route: CamembertRouteConfig = Reflect.getMetadata(CamembertRouteKey, action);

      if (!route) {
        continue;
      }

      route.path = (Reflect.getMetadata(CamembertControllerMetadataKey, controller) || "") + route.path;

      this.routeConfigs.push(route);

      const controllerInstance = this.container.get(route.controller.constructor);

      const routeParams = CamembertUtils.getRouteParameters(controllerInstance, route.action);


      const middleware: Function[] = route.beforeMiddleware ? route.beforeMiddleware : [];

      for (const routerParam of routeParams) {
        if (typeof routerParam.type === 'function') {

          const formValidator = Reflect.getMetadata(CamembertFormKey, routerParam.type);

          if (formValidator) {

            middleware.push((req, res, next) => {

              const formInst = new routerParam.type();

              for (const property of Object.keys(formInst)) {
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
      case 'EADDRINUSE':
        console.error(`Port ${this.environment.port} is already in use`);
        process.exit(1);
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  private onListening(server: http.Server) {

    const addr = server.address();

    const bind = typeof addr === 'string'
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
    if(this.environment.verbose !== false) {
      console.log(`------ ROUTES ------`);
    }
    app._router.stack.forEach(entry => {

      if (entry.route) {
        const route = entry.route;
        Object.keys(route.methods)
          .filter((method) => {
            return !!route.methods[method]
          })
          .map((method) => {
            let r = method.toUpperCase() + ' ' + route.path;

            this.routeConfigs.forEach((route: CamembertRouteConfig) => {
              const paramNames: string[] = [];
              const controllerInstance = this.container.get(route.controller.constructor);
              const routeParams = CamembertUtils.getRouteParameters(controllerInstance, route.action);
              for (const param of routeParams) {
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
