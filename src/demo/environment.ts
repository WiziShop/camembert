import {Environment} from "../app/environment.interface";
import morgan = require("morgan");
import helmet = require("helmet");
import bodyParser = require("body-parser");
let inflector = require("json-inflector");


export const environment: Environment = {
  port: 8888,

  controllersPath: [__dirname + '/controllers/**/*.js']
};
