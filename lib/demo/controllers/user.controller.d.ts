import * as express from "express";
import { UserCreateForm } from "../forms/user/user-create.form";
import { Sandwich } from "../services/sandwich";
export declare class UserController {
    private sandwich;
    constructor(sandwich: Sandwich);
    get(res: express.Response, id: number): void;
    post(res: express.Response, form: UserCreateForm): void;
}
