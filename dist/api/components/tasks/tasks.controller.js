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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tasks_model_1 = __importDefault(require("./tasks.model"));
const responses_1 = require("../../../network/responses");
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../users/user.model"));
class UserController {
    getTasks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function (req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { searchedWord, completed, user_id } = req.query;
                    const { page } = req.params;
                    let id_user = user_id;
                    req.body.userData.role == "USER_ROL" && (id_user = req.body.userData.id);
                    let completedBool = true;
                    String(completed) === "false" && (completedBool = false);
                    String(completed) === "undefined" && (completedBool = false);
                    String(completed) === "true" && (completedBool = true);
                    if (page) {
                        const ITEMS_PER_PAGE = 10;
                        const OFFSET = (Number(page) - 1) * (ITEMS_PER_PAGE);
                        const { count, rows } = yield tasks_model_1.default.findAndCountAll({
                            where: ((searchedWord || id_user || completed) ? [{
                                    [sequelize_1.Op.and]: [
                                        [searchedWord ? { name: { [sequelize_1.Op.like]: `%${searchedWord}%` } } : {}],
                                        [searchedWord ? { description: searchedWord && { [sequelize_1.Op.like]: `%${searchedWord}%` } } : {}],
                                        [String(completed) !== "undefined" ? { completed: Boolean(completedBool) } : {}],
                                        [id_user ? { user_id: Number(id_user) } : {}]
                                    ]
                                }] : {}),
                            offset: OFFSET,
                            limit: ITEMS_PER_PAGE,
                            order: [["id", "DESC"]],
                            include: [{
                                    model: user_model_1.default,
                                    attributes: { exclude: ["password", "estado"] }
                                }]
                        });
                        return ({
                            totalItems: count ? count : 0,
                            itemsPerPage: ITEMS_PER_PAGE,
                            showedItems: rows ? rows : []
                        });
                    }
                    else {
                        return yield tasks_model_1.default.findAll({
                            where: ((searchedWord || id_user || completed) ? [{
                                    [sequelize_1.Op.and]: [
                                        [searchedWord ? { name: { [sequelize_1.Op.like]: `%${searchedWord}%` } } : {}],
                                        [searchedWord ? { description: searchedWord && { [sequelize_1.Op.like]: `%${searchedWord}%` } } : {}],
                                        [completed ? { completed: Boolean(completed) } : {}],
                                        [id_user ? { user_id: Number(id_user) } : {}]
                                    ]
                                }] : {}),
                            order: [["id", "DESC"]],
                            include: [{
                                    model: user_model_1.default,
                                    attributes: { exclude: ["password", "estado"] }
                                }]
                        });
                    }
                });
            })(req).then(body => (0, responses_1.success)({ req, res, body })).catch(next);
        });
    }
    getTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function (req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id } = req.params;
                    return yield tasks_model_1.default.findByPk(id);
                });
            })(req).then(body => (0, responses_1.success)({ req, res, body })).catch(next);
        });
    }
    createTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function (req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { name, description } = req.body;
                    const { id } = req.body.userData;
                    const task = yield tasks_model_1.default.create({ name, description, user_id: id, completed: false });
                    return ({
                        id: task.dataValues.id,
                        name: task.dataValues.name,
                        description: task.dataValues.description
                    });
                });
            })(req).then(body => (0, responses_1.success)({ req, res, body, status: 201 })).catch(next);
        });
    }
    updateTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function (req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id } = req.params;
                    const _a = req.body, { userData } = _a, taskData = __rest(_a, ["userData"]);
                    const task = yield tasks_model_1.default.update(taskData, { where: { id } });
                    if (task.length > 0) {
                        return "Modificado éxitosamente!";
                    }
                    else {
                        throw Error("Error interno");
                    }
                });
            })(req).then(body => (0, responses_1.success)({ req, res, body })).catch(next);
        });
    }
    deleteTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function (req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id } = req.params;
                    const task = yield tasks_model_1.default.destroy({ where: { id } });
                    if (task > 0) {
                        return "Eliminado éxitosamente!";
                    }
                    else {
                        throw Error("Error interno");
                    }
                });
            })(req).then(body => (0, responses_1.success)({ req, res, body })).catch(next);
        });
    }
    toggleTask(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function (req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id } = req.params;
                    const task = yield tasks_model_1.default.findByPk(id);
                    if (task) {
                        task.dataValues.completed = !task.dataValues.completed;
                        yield task.save();
                        return "Modificado éxitosamente!";
                    }
                    else {
                        throw Error("Server error: No se pudo modificar la tarea. Hable con el administrador del endpoint.");
                    }
                });
            })(req).then(body => (0, responses_1.success)({ req, res, body })).catch(next);
        });
    }
}
exports.UserController = UserController;
