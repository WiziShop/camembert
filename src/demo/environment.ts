import {CamembertEnvironment} from "../app/interfaces/camembert-environment.interface";

export const environment: CamembertEnvironment = {
  port: 8888,
  controllersPath: [__dirname + '/controllers/**/*.js'],
};
