
const { DataTypes, Sequelize } = require('sequelize');
const { dbConnection } = require('../database/config');

const Usuario = dbConnection.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING
    },
    correo: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    rol: {
        type: DataTypes.ENUM('ADMIN_ROL', 'USER_ROL'),
        defaultValue: 'USER_ROL',
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    fecha_creacion: {
        type: Sequelize.DATE,
    },
    fecha_modificacion: {
        type: Sequelize.DATE,
    }
}, {
    tableName: "usuarios",
    updatedAt: 'fecha_modificacion',
    createdAt: 'fecha_creacion'
});

module.exports = Usuario;
