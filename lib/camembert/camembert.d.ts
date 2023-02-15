/// <reference types="node" />
import "reflect-metadata";
import * as http from 'http';
import { CamembertEnvironment } from "./interfaces/camembert-environment.interface.js";
import express from "express";
import { CamembertContainer } from "./utils/camembert-container.js";
import { CamembertRouting } from "./interfaces/camembert-routing.interface.js";
/**
 * The Camembert core class
 */
export declare class Camembert {
    private environment;
    private started;
    private route_imported;
    private routes;
    private container;
    private app;
    private routeConfigs;
    /**
     *
     * @param environment
     * @param run
     */
    private constructor();
    /**
     * Configure Camembert before start the serve
     *
     * @param environment The Camembert's configuration
     * @param run Function which will be executed to allow you to configure the app the way you want before start the server
     * @returns {Camembert}
     */
    static configure(environment: CamembertEnvironment, run?: (app: express.Application, routes: CamembertRouting[], container: CamembertContainer) => void): Promise<Camembert>;
    /**
     * Start the server
     *
     * @param onListening Function to execute on the "listening" HTTP server event. If none a default function will be executed
     * @param onError Function to execute on the "error" HTTP server event. If none a default function will be executed
     */
    start(onListening?: (server: http.Server) => void, onError?: (server: http.Server, error: any) => void): void;
    /**
     * Import the controllers to the app
     */
    private importControllers;
    /**
     * Create the DI container
     *
     */
    private setContainer;
    /**
     * Set routing
     */
    private setRouting;
    /**
     * Retrieve all routes for a controller and populate the routes array
     *
     * @param controller
     */
    private extractRoutesFromCamembertController;
    /**
     * Event listener for HTTP server "error" event
     *
     * @param error
     */
    private onError;
    /**
     * Event listener for HTTP server "listening" event.
     */
    private onListening;
    /**
     * Dump the routes into the console
     *
     * @param app
     */
    private dumpRoutes;
}
