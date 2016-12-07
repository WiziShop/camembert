"use strict";
const environment_1 = require("./environment");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
let inflector = require("json-inflector");
const camembert_1 = require("../app/camembert");
camembert_1.Camembert.configure(environment_1.environment, (app, routes, container) => {
    app.use(morgan('combined'));
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(inflector({
        request: 'camelizeLower',
        response: 'underscore'
    }));
    routes.forEach((route) => {
        app[route.httpMethod](route.path, route.middleware);
    });
}).start();
//# sourceMappingURL=index.js.map