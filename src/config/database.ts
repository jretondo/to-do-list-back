import { Sequelize } from 'sequelize';
import { ConfigServer } from './config';

export const sequelize = new Sequelize(
    ConfigServer.prototype.dbConnection.database || '',
    ConfigServer.prototype.dbConnection.user || '',
    ConfigServer.prototype.dbConnection.password, {
    dialect: 'mssql',
    host: ConfigServer.prototype.dbConnection.host,
    port: ConfigServer.prototype.dbConnection.port,
    logging: true,
    dialectOptions: {
        options: {
            useUTC: false,
            dateFirst: 1
        }
    }
});