const { Sequelize } = require('sequelize');

const dbConnection = new Sequelize(process.env.MSSQL_DATABASE, process.env.MSSQL_USER, process.env.MSSQL_PASS, {
    dialect: 'mssql',
    dialectOptions: {
        options: {
            useUTC: false,
            dateFirst: 1
        }
    }
});

module.exports = {
    dbConnection
}
