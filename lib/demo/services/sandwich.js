"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const camembert_injectable_decorator_1 = require("../../app/decorators/camembert-injectable.decorator");
let Sandwich = class Sandwich {
    eat(content) {
        return 'Just ate your sandwich with: ' + content;
    }
};
Sandwich = __decorate([
    camembert_injectable_decorator_1.CamembertInjectable()
], Sandwich);
exports.Sandwich = Sandwich;
//# sourceMappingURL=sandwich.js.map