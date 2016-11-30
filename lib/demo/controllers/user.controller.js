"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const express = require("express");
const camembert_controller_decorator_1 = require("../../app/decorators/camembert-controller.decorator");
const camembert_route_decorator_1 = require("../../app/decorators/camembert-route.decorator");
const user_create_form_1 = require("../forms/user/user-create.form");
const sandwich_1 = require("../services/sandwich");
let UserController = class UserController {
    constructor(sandwich) {
        this.sandwich = sandwich;
    }
    get(res, id) {
        res.send(this.sandwich.eat(id));
    }
    post(res, form) {
        res.send(form);
    }
};
__decorate([
    camembert_route_decorator_1.CamembertRoute("GET", "/:id"), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, Number]), 
    __metadata('design:returntype', void 0)
], UserController.prototype, "get", null);
__decorate([
    camembert_route_decorator_1.CamembertRoute("POST", ""), 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object, user_create_form_1.UserCreateForm]), 
    __metadata('design:returntype', void 0)
], UserController.prototype, "post", null);
UserController = __decorate([
    camembert_controller_decorator_1.CamembertController('/users'), 
    __metadata('design:paramtypes', [sandwich_1.Sandwich])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map