import { UserController } from "./user.controller";
import { BaseRouter } from "../../../models/router";
import { UserMW } from "./user.middleware";
import { ROLES } from "../../../common/enums";

export class UserRouter extends BaseRouter<UserController, UserMW> {
    constructor() {
        super(UserController, UserMW, "user", "users");
    }

    routes() {
        this.router
            .get(`/${this.pluralURL}`, this.controller.getUsers)

            .get(`/${this.singularURL}/:id`,
                this.middleware.verifyToken,
                this.middleware.roleValidator(ROLES.ADMIN_ROLE),
                this.middleware.isValidUserId,
                this.middleware.fieldsValidator,
                this.controller.getUser)

            .post(`/${this.singularURL}/first`,
                this.middleware.requiredInputsValidator,
                this.middleware.inputValidator,
                this.middleware.fieldsValidator,
                this.controller.createUser)

            .post(`/${this.singularURL}`,
                this.middleware.verifyToken,
                this.middleware.roleValidator(ROLES.ADMIN_ROLE),
                this.middleware.requiredInputsValidator,
                this.middleware.inputValidator,
                this.middleware.fieldsValidator,
                this.controller.createUser)

            .put(`/${this.singularURL}/:id`,
                this.middleware.verifyToken,
                this.middleware.roleValidator(ROLES.ADMIN_ROLE),
                this.middleware.isValidUserId,
                this.middleware.inputValidator,
                this.middleware.fieldsValidator,
                this.controller.updateUser)

            .delete(`/${this.singularURL}/:id`,
                this.middleware.verifyToken,
                this.middleware.roleValidator(ROLES.ADMIN_ROLE),
                this.middleware.isValidUserId,
                this.controller.deleteUser)
    }
}