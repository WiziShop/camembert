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
Object.defineProperty(exports, "__esModule", { value: true });
const Validation_1 = require("validator.ts/decorator/Validation");
const camembert_form_decorator_1 = require("../../../app/decorators/camembert-form.decorator");
const Validator_1 = require("validator.ts/Validator");
let UserCreateForm = class UserCreateForm {
    constructor() {
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.password = '';
    }
};
__decorate([
    Validation_1.IsEmail(),
    __metadata("design:type", String)
], UserCreateForm.prototype, "email", void 0);
__decorate([
    Validation_1.NotEmpty(),
    __metadata("design:type", String)
], UserCreateForm.prototype, "firstName", void 0);
__decorate([
    Validation_1.NotEmpty(),
    __metadata("design:type", String)
], UserCreateForm.prototype, "lastName", void 0);
__decorate([
    Validation_1.NotEmpty(),
    __metadata("design:type", String)
], UserCreateForm.prototype, "password", void 0);
UserCreateForm = __decorate([
    camembert_form_decorator_1.CamembertForm((req, res, next, form) => {
        let validator = new Validator_1.Validator();
        if (validator.isValid(form)) {
            return next();
        }
        res.status(400).send('Invalid Form');
    })
], UserCreateForm);
exports.UserCreateForm = UserCreateForm;
//# sourceMappingURL=user-create.form.js.map