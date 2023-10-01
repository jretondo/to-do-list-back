import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database';
import { TABLES } from '../../../common/tables';
import { ROLES } from '../../../common/enums';

interface UserAttributes {
    id?: number;
    name: string;
    email: string;
    password: string;
    role: string;
    state?: boolean;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM(ROLES.ADMIN_ROLE, ROLES.USER_ROLE),
        defaultValue: ROLES.USER_ROLE
    },
    state: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: TABLES.users.tableName,
    sequelize: sequelize,
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: [TABLES.users.columns.email]
        }
    ]
});


export = User;