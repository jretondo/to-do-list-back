import { ValidationChain, check } from 'express-validator';
import { TABLES } from "../../../common/tables";
import { ROLES } from "../../../common/enums";
import DBValidator from "../../../helpers/db-validator";
import { SharedMW } from "../../../middlewares";

export class UserMW extends SharedMW {
    public inputValidator: ValidationChain[] = [];
    public requiredInputsValidator: ValidationChain[] = [];
    public isValidUserId: ValidationChain[] = [];
    constructor() {
        super();
        this.inputValidator = [
            check(TABLES.users.columns.name, 'El nombre debe tener una longitud de 5 caracteres.')
                .if(check(TABLES.users.columns.name).notEmpty()).isLength({ min: 5 }),

            check(TABLES.users.columns.password, 'La contraseña debe tener una longitud de 8 caracteres.')
                .if(check(TABLES.users.columns.password).notEmpty()).isLength({ min: 8 }),

            check(TABLES.users.columns.role, 'El rol debe ser válido')
                .if(check(TABLES.users.columns.role).notEmpty()).isIn([ROLES.ADMIN_ROLE, ROLES.USER_ROLE])
        ]

        this.requiredInputsValidator = [
            check(TABLES.users.columns.name, 'El nombre es requerido.').notEmpty(),
            check(TABLES.users.columns.email, 'El email es requerido.').notEmpty().isEmail(),
            check(TABLES.users.columns.password, 'La contraseña es requerida.').notEmpty(),
            check(TABLES.users.columns.role, 'El rol es requerido.').notEmpty(),
            check(TABLES.users.columns.email).custom(DBValidator.emailIsInDB)
        ]

        this.isValidUserId = [
            check(TABLES.users.columns.id, 'El id debe ser un número válido.').notEmpty().isInt().custom(DBValidator.usersById)
        ]
    }
}