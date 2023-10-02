"use strict";
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
const tables_1 = require("../../../common/tables");
const enums_1 = require("../../../common/enums");
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.ENUM(enums_1.ROLES.ADMIN_ROLE, enums_1.ROLES.USER_ROLE),
        defaultValue: enums_1.ROLES.USER_ROLE
    },
    state: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: tables_1.TABLES.users.tableName,
    sequelize: database_1.sequelize,
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: [tables_1.TABLES.users.columns.email]
        }
    ]
});
module.exports = User;
