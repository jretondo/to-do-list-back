"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
const tables_1 = require("../../../common/tables");
const user_model_1 = __importDefault(require("../users/user.model"));
const enums_1 = require("../../../common/enums");
class Task extends sequelize_1.Model {
}
Task.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    description: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    completed: {
        type: new sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: tables_1.TABLES.tasks.tableName,
    sequelize: database_1.sequelize,
    timestamps: true
});
user_model_1.default.hasMany(Task, {
    foreignKey: tables_1.TABLES.tasks.columns.user_id,
    sourceKey: tables_1.TABLES.users.columns.id,
    onDelete: enums_1.DB_RESTRICTION.CASCADE,
    onUpdate: enums_1.DB_RESTRICTION.CASCADE
});
Task.belongsTo(user_model_1.default, {
    foreignKey: tables_1.TABLES.tasks.columns.user_id,
    targetKey: tables_1.TABLES.users.columns.id,
});
module.exports = Task;
