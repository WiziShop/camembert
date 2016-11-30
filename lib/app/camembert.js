"use strict";
require("reflect-metadata");
const inversify_1 = require("inversify");
const express = require("express");
const http = require('http');
const camembert_injectable_decorator_1 = require("./decorators/camembert-injectable.decorator");
const G = require("glob");
const camembert_controller_decorator_1 = require("./decorators/camembert-controller.decorator");
class Camembert {
    constructor(environment, run) {
        this.environment = environment;
        this.started = false;
        this.routes = [];
        this.importControllers();
        this.setContainer();
        this.setRouting();
        this.app = express();
        if (run && typeof run === 'function') {
            run(this.app, this.routes, this.container);
        }
    }
    static configure(environment, run) {
        return new this(environment, run);
    }
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
    importControllers() {
        this.environment.controllersPath.forEach(controllerPath => {
            G.sync(controllerPath).forEach(file => {
                if (file.split('.').pop() === 'js') {
                    require(file);
                }
            });
        });
    }
    setContainer() {
        this.container = new inversify_1.Container();
        this.container.bind(this.container.constructor).toSelf().inSingletonScope();
        let targets = Reflect.getMetadata(camembert_injectable_decorator_1.CamembertInjectableMetadataKey, camembert_injectable_decorator_1.CamembertInjectable);
        targets.forEach(target => {
            this.container.bind(target).toSelf().inSingletonScope();
        });
    }
    setRouting() {
        let controllers = Reflect.getMetadata(camembert_controller_decorator_1.CamembertControllerMetadataKey, camembert_controller_decorator_1.CamembertController);
        controllers.forEach(controller => {
            this.extractRoutesFromCamembertController(controller);
        });
    }
    extractRoutesFromCamembertController(controller) {
        for (let actionName of Object.getOwnPropertyNames(controller.prototype)) {
            let action = controller.prototype[actionName];
            if (typeof action !== 'function' || !Reflect.hasMetadata('routes', action)) {
                continue;
            }
            let routes = Reflect.getMetadata('routes', action);
            routes.forEach((route) => {
                let camembertRoute = {
                    controllerInstance: this.container.get(route.controller.constructor),
                    path: (Reflect.getMetadata(camembert_controller_decorator_1.CamembertControllerMetadataKey, controller) || "") + route.path,
                    httpMethod: route.httpMethod,
                    middleware: route.middleware,
                    data: route.data,
                };
                this.routes.push(camembertRoute);
            });
        }
    }
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
    onListening(server) {
        let addr = server.address();
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.log('Server started on ' + bind);
    }
    dumpRoutes(app) {
        let ignoredRoutes = ['query', 'expressInit'];
        console.log('------ ROUTES ------');
        app._router.stack.forEach(entry => {
            if (entry.route) {
                let route = entry.route;
                Object.keys(route.methods)
                    .filter((method) => {
                    return !!route.methods[method];
                })
                    .map((method) => {
                    let r = method.toUpperCase() + ' ' + route.path;
                    this.routes.forEach((route) => {
                        let paramNames = [];
                        let routeParams = CamembertUtils.getRouteParameters(route);
                        for (let param of routeParams) {
                            paramNames.push(param.name + ':' + param.type.name);
                        }
                        if (r === route.httpMethod.toUpperCase() + ' ' + route.path) {
                            r += ' → ' + route.controllerInstance.constructor.name + '::' + route.middleware.name + '(' + paramNames.join(', ') + ')';
                        }
                    });
                    console.log(r);
                });
            }
        });
    }
}
exports.Camembert = Camembert;
class CamembertUtils {
    static getRouteParameters(route) {
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
exports.CamembertUtils = CamembertUtils;
//# sourceMappingURL=camembert.js.map