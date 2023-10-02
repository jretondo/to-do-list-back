"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMW = void 0;
const express_validator_1 = require("express-validator");
const tables_1 = require("../../../common/tables");
const db_validator_1 = __importDefault(require("../../../helpers/db-validator"));
const middlewares_1 = require("../../../middlewares");
class TaskMW extends middlewares_1.SharedMW {
    constructor() {
        super();
        this.inputValidator = [
            (0, express_validator_1.check)(tables_1.TABLES.tasks.columns.name, 'El nombre de la tarea debe tener una longitud de al menos 5 caracteres.')
                .if((0, express_validator_1.check)(tables_1.TABLES.tasks.columns.name).notEmpty()).isLength({ min: 5 }),
            (0, express_validator_1.check)(tables_1.TABLES.tasks.columns.description, 'La descripción debe tener al menos una longitus de 10 caracteres.')
                .if((0, express_validator_1.check)(tables_1.TABLES.tasks.columns.description).notEmpty()).isLength({ min: 10 }),
            (0, express_validator_1.check)(tables_1.TABLES.tasks.columns.completed, 'El valor de "completada" debe ser un Booleano.')
                .if((0, express_validator_1.check)(tables_1.TABLES.tasks.columns.completed).notEmpty()).isBoolean()
        ];
        this.requiredInputsValidator = [
            (0, express_validator_1.check)(tables_1.TABLES.tasks.columns.name, 'El nombre es requerido.').notEmpty(),
            (0, express_validator_1.check)(tables_1.TABLES.tasks.columns.description, 'La descripción es requerido.').notEmpty()
        ];
        this.isValidPage = [
            (0, express_validator_1.check)(tables_1.TABLES.tasks.other.page, 'El número de página debe ser un número válido.').notEmpty().isInt()
        ];
        this.isValidTaskId = [
            (0, express_validator_1.check)(tables_1.TABLES.tasks.columns.id, 'El id debe ser un número válido.').notEmpty().isInt().custom(db_validator_1.default.usersById)
        ];
    }
}
exports.TaskMW = TaskMW;
