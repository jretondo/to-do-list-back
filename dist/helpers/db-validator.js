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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
class DBValidator {
}
_a = DBValidator;
DBValidator.User = require("../api/components/users/user.model");
DBValidator.emailIsInDB = (email = '') => __awaiter(void 0, void 0, void 0, function* () {
    const userByEmail = yield _a.User.findOne({ where: { email } });
    if (userByEmail) {
        throw new Error(`El correo: ${email}, ya está registrado`);
    }
});
DBValidator.emailIsNotInDB = (email = '') => __awaiter(void 0, void 0, void 0, function* () {
    const userByEmail = yield _a.User.findOne({ where: { email } });
    if (!userByEmail) {
        throw new Error(`El correo: ${email}, no está registrado`);
    }
});
DBValidator.thereAreUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield _a.User.findAll();
    if (users.length > 0) {
        throw new Error(`Ya existen usuarios registrado!`);
    }
});
DBValidator.usersById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _a.User.findByPk(id);
    if (!user) {
        throw new Error(`El id ${id} no existe`);
    }
});
DBValidator.taskById = (id) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.default = DBValidator;
