"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const tasks_model_1 = __importDefault(require("../api/components/tasks/tasks.model"));
const user_model_1 = __importDefault(require("../api/components/users/user.model"));
const database_1 = require("../config/database");
const task_data_json_1 = __importDefault(require("./task-data.json"));
const user_data_json_1 = __importDefault(require("./user-data.json"));
dotenv_1.default.config({
    path: path_1.default.join(__dirname, "..", "..", '.env')
});
const resetDataBase = () => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.sequelize.sync({ force: true });
});
const insertUserDataExample = () => __awaiter(void 0, void 0, void 0, function* () {
    const salt = bcryptjs_1.default.genSaltSync();
    const userDataScriptPassword = user_data_json_1.default.map(user => {
        user.password = bcryptjs_1.default.hashSync(user.password, salt);
        return user;
    });
    yield user_model_1.default.bulkCreate(userDataScriptPassword);
});
const insertTaskDataExample = () => __awaiter(void 0, void 0, void 0, function* () {
    yield tasks_model_1.default.bulkCreate(task_data_json_1.default);
});
const runExample = () => __awaiter(void 0, void 0, void 0, function* () {
    const environment = process.env.NODE_ENV;
    if (environment !== "development") {
        console.log("Este script solo se puede ejecutar en un entorno de desarrollo!");
        return;
    }
    yield resetDataBase();
    yield insertUserDataExample();
    yield insertTaskDataExample();
});
runExample();
