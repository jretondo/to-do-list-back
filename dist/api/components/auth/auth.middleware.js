"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMW = void 0;
const express_validator_1 = require("express-validator");
const tables_1 = require("../../../common/tables");
const db_validator_1 = __importDefault(require("../../../helpers/db-validator"));
const middlewares_1 = require("../../../middlewares");
class AuthMW extends middlewares_1.SharedMW {
    constructor() {
        super();
        this.inputValidator = [
            (0, express_validator_1.check)(tables_1.TABLES.users.columns.email, 'El email debe ser válido.').isEmail(),
            (0, express_validator_1.check)(tables_1.TABLES.users.columns.password, 'La contraseña debe tener una longitud de 8 caracteres.').notEmpty().isLength({ min: 8 })
        ];
        this.isEmailNotExist = [
            (0, express_validator_1.check)(tables_1.TABLES.users.columns.email).custom(db_validator_1.default.emailIsNotInDB)
        ];
    }
}
exports.AuthMW = AuthMW;
