import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import Task from "../api/components/tasks/tasks.model";
import User from "../api/components/users/user.model"
import { sequelize } from "../config/database";
import TaskData from './task-data.json';
import UserData from './user-data.json';

dotenv.config({
    path: path.join(__dirname, "..", "..", '.env')
});

const resetDataBase = async () => {
    await sequelize.sync({ force: true });
}

const insertUserDataExample = async () => {
    const salt = bcryptjs.genSaltSync();

    const userDataScriptPassword = UserData.map(user => {
        user.password = bcryptjs.hashSync(user.password, salt)
        return user;
    });
    await User.bulkCreate(userDataScriptPassword);
}

const insertTaskDataExample = async () => {
    await Task.bulkCreate(TaskData);
}

const runExample = async () => {
    const environment = process.env.NODE_ENV;
    if (environment !== "development") {
        console.log("Este script solo se puede ejecutar en un entorno de desarrollo!");
        return;
    }
    await resetDataBase();
    await insertUserDataExample();
    await insertTaskDataExample();
}

runExample();