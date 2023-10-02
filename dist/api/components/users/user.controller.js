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
const user_model_1 = __importDefault(require("./user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const tables_1 = require("../../../common/tables");
const responses_1 = require("../../../network/responses");
class UserController {
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function () {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield user_model_1.default.findAll({
                        attributes: { exclude: [tables_1.TABLES.users.columns.password] }
                    });
                });
            })().then(body => (0, responses_1.success)({ req, res, body })).catch(next);
        });
    }
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function (req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id } = req.params;
                    return yield user_model_1.default.findByPk(id, {
                        attributes: { exclude: [tables_1.TABLES.users.columns.password] }
                    });
                });
            })(req).then(body => (0, responses_1.success)({ req, res, body })).catch(next);
        });
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function (req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { name, email, role, password } = req.body;
                    const salt = bcryptjs_1.default.genSaltSync();
                    const newUser = {
                        name,
                        email,
                        password: bcryptjs_1.default.hashSync(password, salt),
                        role
                    };
                    const user = yield user_model_1.default.create(newUser);
                    user.save();
                    return ({
                        id: user.dataValues.id,
                        name: user.dataValues.name,
                        email: user.dataValues.email,
                        role: user.dataValues.role
                    });
                });
            })(req).then(body => (0, responses_1.success)({ req, res, body, status: 201 })).catch(next);
        });
    }
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function (req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id } = req.params;
                    const _a = req.body, { email } = _a, userData = __rest(_a, ["email"]);
                    if (userData.password) {
                        const salt = bcryptjs_1.default.genSaltSync();
                        userData.password = bcryptjs_1.default.hashSync(userData.password, salt);
                    }
                    const user = yield user_model_1.default.update(userData, { where: { id } });
                    if (user.length > 0) {
                        return "Modificado éxitosamente!";
                    }
                    else {
                        throw Error("Server error: No se pudo modificar el usuario. Hable con el administrador del endpoint.");
                    }
                });
            })(req).then(body => (0, responses_1.success)({ req, res, body })).catch(next);
        });
    }
    disabledUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function (req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id } = req.params;
                    const user = yield user_model_1.default.update({ state: false }, { where: { id } });
                    if (user.length > 0) {
                        return "Eliminado éxitosamente!";
                    }
                    else {
                        throw Error("Server error: No se pudo eliminar el usuario. Hable con el administrador del endpoint.");
                    }
                });
            })(req).then(body => (0, responses_1.success)({ req, res, body })).catch(next);
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function (req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id } = req.params;
                    const user = yield user_model_1.default.destroy({ where: { id } });
                    if (user > 0) {
                        return "Eliminado éxitosamente!";
                    }
                    else {
                        throw Error("Server error: No se pudo eliminar el usuario. Hable con el administrador del endpoint.");
                    }
                });
            })(req).then(body => (0, responses_1.success)({ req, res, body })).catch(next);
        });
    }
}
exports.UserController = UserController;
