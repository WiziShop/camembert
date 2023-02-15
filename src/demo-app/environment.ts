
import * as url from 'url';
import { CamembertEnvironment } from 'camembert/interfaces/camembert-environment.interface.js';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const environment: CamembertEnvironment = {
  port: 8888,
  controllersPath: [__dirname + '/controllers/**/*.js'],
};
