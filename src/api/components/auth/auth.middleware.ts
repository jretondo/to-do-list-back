import { ValidationChain, check } from 'express-validator';
import { TABLES } from "../../../common/tables";
import DBValidator from "../../../helpers/db-validator";
import { SharedMW } from "../../../middlewares";

export class AuthMW extends SharedMW {
    public inputValidator: ValidationChain[];
    public isEmailNotExist: ValidationChain[];
    constructor() {
        super();

        this.inputValidator = [
            check(TABLES.users.columns.email, 'El email debe ser válido.').isEmail(),
            check(TABLES.users.columns.password, 'La contraseña debe tener una longitud de 8 caracteres.').notEmpty().isLength({ min: 8 })
        ]

        this.isEmailNotExist = [
            check(TABLES.users.columns.email).custom(DBValidator.emailIsNotInDB)
        ]
    }
}