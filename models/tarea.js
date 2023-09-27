const { DataTypes, Sequelize } = require('sequelize');
const { dbConnection } = require('../database/config');

const Tarea = dbConnection.define("Tarea", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING
    },
    descripcion: {
        type: DataTypes.STRING
    },
    fecha_creacion: {
        type: Sequelize.DATE
    },
    completada: {
        type: DataTypes.BOOLEAN
    }
}, {
    tableName: "tareas",
    createdAt: 'fecha_creacion'
});

module.exports = Tarea;
