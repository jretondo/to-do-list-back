import { UserController } from "./auth.controller";
import { BaseRouter } from "../../../models/router";
import { AuthMW } from "./auth.middleware";

export class AuthRouter extends BaseRouter<UserController, AuthMW> {
    constructor() {
        super(UserController, AuthMW, "auth", "auth");
    }

    routes() {
        this.router
            .post(`/${this.singularURL}/login`,
                this.middleware.inputValidator,
                this.middleware.isEmailNotExist,
                this.middleware.fieldsValidator,
                this.controller.login
            )
    }
}