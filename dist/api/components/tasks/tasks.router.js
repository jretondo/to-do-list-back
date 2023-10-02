"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRouter = void 0;
const tasks_controller_1 = require("./tasks.controller");
const router_1 = require("../../../models/router");
const tasks_middleware_1 = require("./tasks.middleware");
const enums_1 = require("../../../common/enums");
class TaskRouter extends router_1.BaseRouter {
    constructor() {
        super(tasks_controller_1.UserController, tasks_middleware_1.TaskMW, "task", "tasks");
    }
    routes() {
        this.router
            .get(`/${this.pluralURL}/paginated/:page`, this.middleware.verifyToken, this.middleware.roleValidator(enums_1.ROLES.ADMIN_ROLE, enums_1.ROLES.USER_ROLE), this.middleware.isValidPage, this.middleware.fieldsValidator, this.controller.getTasks)
            .get(`/${this.pluralURL}`, this.middleware.verifyToken, this.middleware.roleValidator(enums_1.ROLES.ADMIN_ROLE, enums_1.ROLES.USER_ROLE), this.middleware.fieldsValidator, this.controller.getTasks)
            .get(`/${this.singularURL}/:id`, this.middleware.verifyToken, this.middleware.roleValidator(enums_1.ROLES.ADMIN_ROLE, enums_1.ROLES.USER_ROLE), this.middleware.isValidTaskId, this.middleware.fieldsValidator, this.controller.getTask)
            .post(`/${this.singularURL}`, this.middleware.verifyToken, this.middleware.roleValidator(enums_1.ROLES.ADMIN_ROLE, enums_1.ROLES.USER_ROLE), this.middleware.requiredInputsValidator, this.middleware.inputValidator, this.middleware.fieldsValidator, this.controller.createTask)
            .put(`/${this.singularURL}/:id`, this.middleware.verifyToken, this.middleware.roleValidator(enums_1.ROLES.ADMIN_ROLE, enums_1.ROLES.USER_ROLE), this.middleware.isValidTaskId, this.middleware.inputValidator, this.middleware.fieldsValidator, this.controller.updateTask)
            .delete(`/${this.singularURL}/:id`, this.middleware.verifyToken, this.middleware.roleValidator(enums_1.ROLES.ADMIN_ROLE), this.middleware.isValidTaskId, this.middleware.fieldsValidator, this.controller.deleteTask);
    }
}
exports.TaskRouter = TaskRouter;
