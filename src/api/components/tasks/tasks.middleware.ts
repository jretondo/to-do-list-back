import { ValidationChain, check } from 'express-validator';
import { TABLES } from "../../../common/tables";
import DBValidator from "../../../helpers/db-validator";
import { SharedMW } from "../../../middlewares";

export class TaskMW extends SharedMW {
    public inputValidator: ValidationChain[];
    public requiredInputsValidator: ValidationChain[];
    public isValidTaskId: ValidationChain[];
    public isValidPage: ValidationChain[];
    constructor() {
        super();

        this.inputValidator = [
            check(TABLES.tasks.columns.name, 'El nombre de la tarea debe tener una longitud de al menos 5 caracteres.')
                .if(check(TABLES.tasks.columns.name).notEmpty()).isLength({ min: 5 }),

            check(TABLES.tasks.columns.description, 'La descripción debe tener al menos una longitus de 10 caracteres.')
                .if(check(TABLES.tasks.columns.description).notEmpty()).isLength({ min: 10 }),

            check(TABLES.tasks.columns.completed, 'El valor de "completada" debe ser un Booleano.')
                .if(check(TABLES.tasks.columns.completed).notEmpty()).isBoolean()
        ]

        this.requiredInputsValidator = [
            check(TABLES.tasks.columns.name, 'El nombre es requerido.').notEmpty(),
            check(TABLES.tasks.columns.description, 'La descripción es requerido.').notEmpty()
        ];

        this.isValidPage = [
            check(TABLES.tasks.other.page, 'El número de página debe ser un número válido.').notEmpty().isInt()]

        this.isValidTaskId = [
            check(TABLES.tasks.columns.id, 'El id debe ser un número válido.').notEmpty().isInt().custom(DBValidator.usersById)]
    }
}