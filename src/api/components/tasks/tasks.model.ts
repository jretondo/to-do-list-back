import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';
import { TABLES } from '../../../common/tables';
import User from '../users/user.model';
import { DB_RESTRICTION } from '../../../common/enums';

interface TaskAttributes {
    id?: number;
    name: string;
    description: string;
    completed: boolean;
    user_id: number;
}

type TaskCreationAttributes = Optional<TaskAttributes, 'id'>;

class Task extends Model<TaskAttributes, TaskCreationAttributes> { }

Task.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: new DataTypes.STRING(128),
        allowNull: false
    },
    description: {
        type: new DataTypes.STRING(128),
        allowNull: false
    },
    completed: {
        type: new DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: TABLES.tasks.tableName,
    sequelize: sequelize,
    timestamps: true
});

User.hasMany(Task, {
    foreignKey: TABLES.tasks.columns.user_id,
    sourceKey: TABLES.users.columns.id,
    onDelete: DB_RESTRICTION.CASCADE,
    onUpdate: DB_RESTRICTION.CASCADE
})

Task.belongsTo(User, {
    foreignKey: TABLES.tasks.columns.user_id,
    targetKey: TABLES.users.columns.id,
})


export = Task;