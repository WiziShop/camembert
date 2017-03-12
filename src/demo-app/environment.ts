import {CamembertEnvironment} from 'camembert';

export const environment: CamembertEnvironment = {
  port: 8888,
  controllersPath: [__dirname + '/controllers/**/*.js'],
};
