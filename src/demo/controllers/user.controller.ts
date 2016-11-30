import * as express from "express";

import {CamembertController} from "../../app/decorators/camembert-controller.decorator";
import {CamembertRoute} from "../../app/decorators/camembert-route.decorator";
import {UserCreateForm} from "../forms/user/user-create.form";
import {Sandwich} from "../services/sandwich";


@CamembertController('/users')
export class UserController {

  constructor(private sandwich: Sandwich) {

  }


  @CamembertRoute("GET", "/:id")
  get(res: express.Response, id: number) {

    res.send(this.sandwich.eat(id));
  }

  @CamembertRoute("POST", "")
  post(res: express.Response, form: UserCreateForm) {
    res.send(form);
  }
}
