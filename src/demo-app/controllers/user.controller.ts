import * as express from 'express';

import { CamembertController } from 'camembert';
import { CamembertRoute } from 'camembert';
import { Sandwich } from '../services/sandwich.js';
import { UserCreateForm } from '../forms/user/user-create.form.js';


@CamembertController('/users')
export class UserController {

  /**
   *
   * @param sandwich
   */
  constructor(private sandwich: Sandwich) {

  }


  @CamembertRoute("GET", "/:id", [
    (req, res, next) => {
      console.log("1. Before middleware");
      next();
    }
  ], [
    (req, res, next) => {
      console.log("3. After middleware");
      next();
    },
  ])
  getById(res: express.Response, id: number, next) {
    console.log("2. Custom middleware");

    res.send(this.sandwich.eat(id));

    next();
  }

  @CamembertRoute("POST", "")
  create(res: express.Response, form: UserCreateForm) {
    res.send(form);
  }
}
