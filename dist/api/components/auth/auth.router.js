"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const auth_controller_1 = require("./auth.controller");
const router_1 = require("../../../models/router");
const auth_middleware_1 = require("./auth.middleware");
class AuthRouter extends router_1.BaseRouter {
    constructor() {
        super(auth_controller_1.UserController, auth_middleware_1.AuthMW, "auth", "auth");
    }
    routes() {
        this.router
            .post(`/${this.singularURL}/login`, this.middleware.inputValidator, this.middleware.isEmailNotExist, this.middleware.fieldsValidator, this.controller.login);
    }
}
exports.AuthRouter = AuthRouter;
