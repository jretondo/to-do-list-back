"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMW = void 0;
const express_validator_1 = require("express-validator");
const tables_1 = require("../../../common/tables");
const enums_1 = require("../../../common/enums");
const db_validator_1 = __importDefault(require("../../../helpers/db-validator"));
const middlewares_1 = require("../../../middlewares");
class UserMW extends middlewares_1.SharedMW {
    constructor() {
        super();
        this.inputValidator = [];
        this.requiredInputsValidator = [];
        this.isValidUserId = [];
        this.inputValidator = [
            (0, express_validator_1.check)(tables_1.TABLES.users.columns.name, 'El nombre debe tener una longitud de 5 caracteres.')
                .if((0, express_validator_1.check)(tables_1.TABLES.users.columns.name).notEmpty()).isLength({ min: 5 }),
            (0, express_validator_1.check)(tables_1.TABLES.users.columns.password, 'La contraseña debe tener una longitud de 8 caracteres.')
                .if((0, express_validator_1.check)(tables_1.TABLES.users.columns.password).notEmpty()).isLength({ min: 8 }),
            (0, express_validator_1.check)(tables_1.TABLES.users.columns.role, 'El rol debe ser válido')
                .if((0, express_validator_1.check)(tables_1.TABLES.users.columns.role).notEmpty()).isIn([enums_1.ROLES.ADMIN_ROLE, enums_1.ROLES.USER_ROLE])
        ];
        this.requiredInputsValidator = [
            (0, express_validator_1.check)(tables_1.TABLES.users.columns.name, 'El nombre es requerido.').notEmpty(),
            (0, express_validator_1.check)(tables_1.TABLES.users.columns.email, 'El email es requerido.').notEmpty().isEmail(),
            (0, express_validator_1.check)(tables_1.TABLES.users.columns.password, 'La contraseña es requerida.').notEmpty(),
            (0, express_validator_1.check)(tables_1.TABLES.users.columns.role, 'El rol es requerido.').notEmpty(),
            (0, express_validator_1.check)(tables_1.TABLES.users.columns.email).custom(db_validator_1.default.emailIsInDB)
        ];
        this.isValidUserId = [
            (0, express_validator_1.check)(tables_1.TABLES.users.columns.id, 'El id debe ser un número válido.').notEmpty().isInt().custom(db_validator_1.default.usersById)
        ];
    }
}
exports.UserMW = UserMW;
