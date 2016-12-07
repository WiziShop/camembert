# Camembert

A powerful and lightweight framework to create simple backend with dependency injection thanks to [InversifyJS](https://github.com/inversify/InversifyJS) and Typescript

With Camembert the most important part is in your controllers. So you have to tell to Camembert where 
are they to load them before the server is started.

You do that by configuring your environment file: 
```ts 
import {CamembertEnvironment} from "../app/interfaces/camembert-environment.interface";

export const environment: CamembertEnvironment = {
  port: 8888,
  controllersPath: [__dirname + '/controllers/**/*.js'],
};
 
```

## Controllers and Routes
First you have to define you controller class with the `CamembertController` decorator

```ts
@CamembertController('/users')
export class UserController {
}

```

Then register a new route inside the controller with the `CamembertRoute` decorator
```ts 

@CamembertRoute("POST", "/group/:id")
  create(res: express.Response, id: number, form: UserCreateForm, next) {
    res.send(form);
  }

```

This method will be called for each HTTP POST method with the route `/users/group/myId`

Thanks to the decorator, the method parameters will be automatically injected by their names (except for the form parameter, which is injected by its type)
 
There are 3 types of parameters:
- The express one: req, res, next
- The request parameters
- A form instance


- res: will be the express response
- id: will be the res.params.id
- form: will be populated with a UserCreateForm instance and its members will be get from the body request
- next: will be the express next method


## Forms
Camembert provide a `CamembertForm` decorator for you form.
This decorator take a middleware method as parameter which will be executed before the controller action method.
The last parameter of this middleware is the form instance populated with the body match field.

Here is an example: 
```ts 
import {IsEmail, NotEmpty} from "validator.ts/decorator/Validation";
import {CamembertForm} from "../../../app/decorators/camembert-form.decorator";
import {Validator} from "validator.ts/Validator";

@CamembertForm((req, res, next, form: UserCreateForm) => {
  let validator = new Validator();

  if (validator.isValid(form)) {
    next();
    return ;
  }
  res.status(400).send('Invalid Form');
})
export class UserCreateForm {
  @IsEmail()
  email: string = '';

  @NotEmpty()
  firstName: string = '';

  @NotEmpty()
  lastName: string = '';

  @NotEmpty()
  password: string = '';

}


```

Here we create a simple form and we use the handy [validator.ts](https://www.npmjs.com/package/validator.ts) module to 
validate it.
If the form is not valid it will send an HTTP 400 response, and the **create** method above won't be executed.


## Dependency injection

To handle dependency injection, you will use the `CamembertInjectable` decorator. 
For example:
 
```ts 
import {CamembertInjectable} from "../../app/decorators/camembert-injectable.decorator";

@CamembertInjectable()
export class Sandwich {
  eat(content: string) {
    return 'Just ate your sandwich with: ' + content;
  }
}

```

Then inject your service into the desired class to consume it. That's it: 

```ts

@CamembertController('/users')
export class UserController {

  /**
   *
   * @param sandwich
   */
  constructor(private sandwich: Sandwich) {
    this.sandwich.eat('cheese');
  }


```

## Register routes and start the server

When you've set your controllers and routes it's time to start the server. 
Here is an example of what your server entrypoint would look like: 

```ts

import {environment} from "./environment";
import * as express from "express";
import morgan = require("morgan");
import helmet = require("helmet");
import bodyParser = require("body-parser");
let inflector = require("json-inflector");
import {Camembert, CamembertRouting, CamembertContainer} from "../app/camembert";


Camembert.configure(environment, (app: express.Application, routes: CamembertRouting[], container: CamembertContainer) => {

  //Register you own middleware here
  app.use(morgan('combined'));

  app.use(helmet());

  app.use(bodyParser.json());

  app.use(inflector({
    request: 'camelizeLower',
    response: 'underscore'
  }));

  
  //Register the routes
  routes.forEach((route) => {
    app[route.httpMethod](route.path, route.middleware);
  });

}).start();


```

1. We call Camembert configure with the configuration file
2. The configure method will call our callback to let us configure our middleware
3. The configure method returns an Camembert instance, we call the start method to start the server
