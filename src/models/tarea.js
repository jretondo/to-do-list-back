const { DataTypes, Sequelize } = require('sequelize');
const { dbConnection } = require('../database/config');
const Usuario = require('./usuario');

const Tarea = dbConnection.define("Tarea", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_creacion: {
        type: Sequelize.DATE
    },
    completada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "tareas",
    createdAt: 'fecha_creacion',
    updatedAt: false
});

Usuario.hasMany(Tarea, {
    foreignKey: "usuario_id",
    sourceKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})

Tarea.belongsTo(Usuario, {
    foreignKey: "usuario_id",
    targetKey: "id"
})

module.exports = Tarea;
