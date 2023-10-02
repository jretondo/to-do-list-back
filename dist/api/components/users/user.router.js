"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const user_controller_1 = require("./user.controller");
const router_1 = require("../../../models/router");
const user_middleware_1 = require("./user.middleware");
const enums_1 = require("../../../common/enums");
class UserRouter extends router_1.BaseRouter {
    constructor() {
        super(user_controller_1.UserController, user_middleware_1.UserMW, "user", "users");
    }
    routes() {
        this.router
            .get(`/${this.pluralURL}`, this.controller.getUsers)
            .get(`/${this.singularURL}/:id`, this.middleware.verifyToken, this.middleware.roleValidator(enums_1.ROLES.ADMIN_ROLE), this.middleware.isValidUserId, this.middleware.fieldsValidator, this.controller.getUser)
            .post(`/${this.singularURL}/first`, this.middleware.requiredInputsValidator, this.middleware.inputValidator, this.middleware.fieldsValidator, this.controller.createUser)
            .post(`/${this.singularURL}`, this.middleware.verifyToken, this.middleware.roleValidator(enums_1.ROLES.ADMIN_ROLE), this.middleware.requiredInputsValidator, this.middleware.inputValidator, this.middleware.fieldsValidator, this.controller.createUser)
            .put(`/${this.singularURL}/:id`, this.middleware.verifyToken, this.middleware.roleValidator(enums_1.ROLES.ADMIN_ROLE), this.middleware.isValidUserId, this.middleware.inputValidator, this.middleware.fieldsValidator, this.controller.updateUser)
            .delete(`/${this.singularURL}/:id`, this.middleware.verifyToken, this.middleware.roleValidator(enums_1.ROLES.ADMIN_ROLE), this.middleware.isValidUserId, this.controller.deleteUser);
    }
}
exports.UserRouter = UserRouter;
