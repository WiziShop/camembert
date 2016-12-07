/// <reference types="node" />
import "reflect-metadata";
import { Container } from "inversify";
import * as express from "express";
import * as http from 'http';
import { CamembertEnvironment } from "./interfaces/camembert-environment.interface";
export interface CamembertRouting {
    path: string;
    httpMethod: string;
    middleware: Function[];
}
export interface CamembertRouteRouteParameter {
    name: string;
    type: any;
}
export declare class CamembertContainer extends Container {
}
export declare class Camembert {
    private environment;
    private started;
    private routes;
    private container;
    private app;
    private routeConfigs;
    private constructor(environment, run?);
    static configure(environment: CamembertEnvironment, run?: (app: express.Application, routes: CamembertRouting[], container: CamembertContainer) => void): Camembert;
    start(onListening?: (server: http.Server) => void, onError?: (server: http.Server, error: any) => void): void;
    private importControllers();
    private setContainer();
    private setRouting();
    private extractRoutesFromCamembertController(controller);
    private onError(error);
    private onListening(server);
    private dumpRoutes(app);
}
export declare class CamembertUtils {
    static getRouteParameters(ControllerInstance: any, method: any): CamembertRouteRouteParameter[];
}
