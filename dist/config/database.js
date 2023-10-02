"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
exports.sequelize = new sequelize_1.Sequelize(config_1.ConfigServer.prototype.dbConnection.database || '', config_1.ConfigServer.prototype.dbConnection.user || '', config_1.ConfigServer.prototype.dbConnection.password, {
    dialect: 'mssql',
    host: config_1.ConfigServer.prototype.dbConnection.host,
    port: config_1.ConfigServer.prototype.dbConnection.port,
    logging: false,
    dialectOptions: {
        options: {
            useUTC: false,
            dateFirst: 1
        }
    }
});
