/// <reference types="node" />
import "reflect-metadata";
import { Container } from "inversify";
import * as express from "express";
import * as http from 'http';
import { Environment } from "./environment.interface";
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
export declare class Camembert {
    private environment;
    private started;
    private routes;
    private container;
    private app;
    private constructor(environment, run?);
    static configure(environment: Environment, run?: (app: express.Application, routes: CamembertRoute[], container: Container) => void): Camembert;
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
    static getRouteParameters(route: CamembertRoute): CamembertRouteRouteParameter[];
}
