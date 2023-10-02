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
exports.UserController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../users/user.model"));
const jwt_generator_1 = __importDefault(require("../../../helpers/jwt-generator"));
const responses_1 = require("../../../network/responses");
class UserController {
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (function (req) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { email, password } = req.body;
                    const user = yield user_model_1.default.findOne({ where: { email } });
                    if (!user) {
                        console.log('No existe el correo');
                        return false;
                    }
                    if (!user.dataValues.email) {
                        console.log('El usuario no está activo');
                        return false;
                    }
                    const validPassword = bcryptjs_1.default.compareSync(password, user.dataValues.password);
                    if (!validPassword) {
                        console.log('La contraseña es incorrecta');
                        return false;
                    }
                    const userData = {
                        id: user.dataValues.id || 0,
                        name: user.dataValues.name,
                        email: user.dataValues.email,
                        role: user.dataValues.role
                    };
                    const token = yield jwt_generator_1.default.generate(userData);
                    return ({
                        userData,
                        token
                    });
                });
            })(req).then(body => (0, responses_1.success)({ req, res, body })).catch(next);
        });
    }
}
exports.UserController = UserController;
