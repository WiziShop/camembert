"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const express = require("express");
const http = require("http");
const camembert_injectable_decorator_1 = require("./decorators/camembert-injectable.decorator");
const G = require("glob");
const camembert_controller_decorator_1 = require("./decorators/camembert-controller.decorator");
const camembert_route_decorator_1 = require("./decorators/camembert-route.decorator");
const camembert_route_middleware_1 = require("./middlewares/camembert-route.middleware");
const camembert_form_decorator_1 = require("./decorators/camembert-form.decorator");
class CamembertContainer extends inversify_1.Container {
}
exports.CamembertContainer = CamembertContainer;
/**
 * The Camembert core class
 */
class Camembert {
    /**
     *
     * @param environment
     * @param run
     */
    constructor(environment, run) {
        this.environment = environment;
        this.started = false;
        this.routes = [];
        this.routeConfigs = [];
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
    static configure(environment, run) {
        return new this(environment, run);
    }
    /**
     * Start the server
     *
     * @param onListening Function to execute on the "listening" HTTP server event. If none a default function will be executed
     * @param onError Function to execute on the "error" HTTP server event. If none a default function will be executed
     */
    start(onListening, onError) {
        if (this.started) {
            throw 'Server already started';
        }
        let server = http.createServer(this.app);
        server.listen(this.environment.port);
        this.started = true;
        server.on('listening', () => {
            if (onListening && typeof onListening === 'function') {
                onListening(server);
            }
            else {
                this.onListening(server);
            }
            this.dumpRoutes(this.app);
        });
        server.on('error', (error) => {
            if (onError && typeof onError === 'function') {
                onError(server, error);
            }
            else {
                this.onError(error);
            }
        });
    }
    /**
     * Import the controllers to the app
     */
    importControllers() {
        this.environment.controllersPath.forEach(controllerPath => {
            G.sync(controllerPath).forEach(file => {
                if (file.split('.').pop() === 'js') {
                    require(file);
                }
            });
        });
    }
    /**
     * Create the DI container
     *
     */
    setContainer() {
        this.container = new CamembertContainer();
        this.container.bind(CamembertContainer).toConstantValue(this.container);
        let targets = Reflect.getMetadata(camembert_injectable_decorator_1.CamembertInjectableMetadataKey, camembert_injectable_decorator_1.CamembertInjectable);
        targets.forEach(target => {
            this.container.bind(target).toSelf().inSingletonScope();
        });
    }
    /**
     * Set routing
     */
    setRouting() {
        let controllers = Reflect.getMetadata(camembert_controller_decorator_1.CamembertControllerMetadataKey, camembert_controller_decorator_1.CamembertController);
        controllers.forEach(controller => {
            this.extractRoutesFromCamembertController(controller);
        });
    }
    /**
     * Retrieve all routes for a controller and populate the routes array
     *
     * @param controller
     */
    extractRoutesFromCamembertController(controller) {
        for (let actionName of Object.getOwnPropertyNames(controller.prototype)) {
            let action = controller.prototype[actionName];
            if (typeof action !== 'function') {
                continue;
            }
            let route = Reflect.getMetadata(camembert_route_decorator_1.CamembertRouteKey, action);
            if (!route) {
                continue;
            }
            route.path = (Reflect.getMetadata(camembert_controller_decorator_1.CamembertControllerMetadataKey, controller) || "") + route.path;
            this.routeConfigs.push(route);
            let controllerInstance = this.container.get(route.controller.constructor);
            let routeParams = CamembertUtils.getRouteParameters(controllerInstance, route.action);
            let middleware = route.beforeMiddleware ? route.beforeMiddleware : [];
            for (let routerParam of routeParams) {
                if (typeof routerParam.type === 'function') {
                    let formValidator = Reflect.getMetadata(camembert_form_decorator_1.CamembertFormKey, routerParam.type);
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
            middleware.push(camembert_route_middleware_1.CamembertRouteMiddleware(controllerInstance, route.action, routeParams));
            route.afterMiddleware.forEach(m => {
                middleware.push(m);
            });
            this.routes.push({
                path: route.path,
                httpMethod: route.httpMethod,
                middleware: middleware,
            });
        }
    }
    /**
     * Event listener for HTTP server "error" event
     *
     * @param error
     */
    onError(error) {
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
    onListening(server) {
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
    dumpRoutes(app) {
        let ignoredRoutes = ['query', 'expressInit'];
        console.log(`------ ROUTES ------`);
        app._router.stack.forEach(entry => {
            if (entry.route) {
                let route = entry.route;
                Object.keys(route.methods)
                    .filter((method) => {
                    return !!route.methods[method];
                })
                    .map((method) => {
                    let r = method.toUpperCase() + ' ' + route.path;
                    this.routeConfigs.forEach((route) => {
                        let paramNames = [];
                        let controllerInstance = this.container.get(route.controller.constructor);
                        let routeParams = CamembertUtils.getRouteParameters(controllerInstance, route.action);
                        for (let param of routeParams) {
                            paramNames.push(param.name + ':' + param.type.name);
                        }
                        if (r === route.httpMethod.toUpperCase() + ' ' + route.path) {
                            r += ' → ' + route.controller.constructor.name + '::' + route.action.name + '(' + paramNames.join(', ') + ')';
                        }
                    });
                    console.log(r);
                });
            }
        });
        console.log(`------ ${this.routeConfigs.length} routes found ------`);
    }
}
exports.Camembert = Camembert;
/**
 * CamembertUtils class
 */
class CamembertUtils {
    /**
     * Retrieve route parameters
     *
     * @param ControllerInstance
     * @param method
     * @returns {CamembertRouteRouteParameter[]}
     */
    static getRouteParameters(ControllerInstance, method) {
        let routeParams = [];
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
exports.CamembertUtils = CamembertUtils;
//# sourceMappingURL=camembert.js.map