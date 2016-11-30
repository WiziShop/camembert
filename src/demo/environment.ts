import {CamembertEnvironment} from "../app/interfaces/camembert-environment.interface";
import morgan = require("morgan");
import helmet = require("helmet");
import bodyParser = require("body-parser");
let inflector = require("json-inflector");


export const environment: CamembertEnvironment = {
  port: 8888,

  controllersPath: [__dirname + '/controllers/**/*.js']
};
