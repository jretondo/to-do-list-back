import { UserController } from "./tasks.controller";
import { BaseRouter } from "../../../models/router";
import { TaskMW } from "./tasks.middleware";
import { ROLES } from "../../../common/enums";

export class TaskRouter extends BaseRouter<UserController, TaskMW> {
    constructor() {
        super(UserController, TaskMW, "task", "tasks");
    }

    routes() {
        this.router
            .get(`/${this.pluralURL}/paginated/:page`,
                this.middleware.verifyToken,
                this.middleware.roleValidator(ROLES.ADMIN_ROLE, ROLES.USER_ROLE),
                this.middleware.isValidPage,
                this.middleware.fieldsValidator,
                this.controller.getTasks)

            .get(`/${this.pluralURL}`,
                this.middleware.verifyToken,
                this.middleware.roleValidator(ROLES.ADMIN_ROLE, ROLES.USER_ROLE),
                this.middleware.fieldsValidator,
                this.controller.getTasks)

            .get(`/${this.singularURL}/:id`,
                this.middleware.verifyToken,
                this.middleware.roleValidator(ROLES.ADMIN_ROLE, ROLES.USER_ROLE),
                this.middleware.isValidTaskId,
                this.middleware.fieldsValidator,
                this.controller.getTask
            )

            .post(`/${this.singularURL}`,
                this.middleware.verifyToken,
                this.middleware.roleValidator(ROLES.ADMIN_ROLE, ROLES.USER_ROLE),
                this.middleware.requiredInputsValidator,
                this.middleware.inputValidator,
                this.middleware.fieldsValidator,
                this.controller.createTask
            )

            .put(`/${this.singularURL}/:id`,
                this.middleware.verifyToken,
                this.middleware.roleValidator(ROLES.ADMIN_ROLE, ROLES.USER_ROLE),
                this.middleware.isValidTaskId,
                this.middleware.inputValidator,
                this.middleware.fieldsValidator,
                this.controller.updateTask
            )

            .delete(`/${this.singularURL}/:id`,
                this.middleware.verifyToken,
                this.middleware.roleValidator(ROLES.ADMIN_ROLE),
                this.middleware.isValidTaskId,
                this.middleware.fieldsValidator,
                this.controller.deleteTask
            )
    }
}