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
exports.SharedMW = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responses_1 = require("../network/responses");
const user_model_1 = __importDefault(require("../api/components/users/user.model"));
const express_validator_1 = require("express-validator");
class SharedMW {
    verifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.header('authorization');
            if (!token) {
                return (0, responses_1.error)({ req, res, body: "No se envió ningún token - Para esta consulta es necesario un token valido", status: 401 });
            }
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || 'secret');
                const user = yield user_model_1.default.findByPk(decodedToken.id);
                if (!(user === null || user === void 0 ? void 0 : user.dataValues.id)) {
                    console.log('Usuario no existe en la BD');
                    return (0, responses_1.error)({ req, res, body: "Token no válido - Usuario inexistente/inactivo o token expirado", status: 401 });
                }
                if (!user.dataValues.state) {
                    console.log('Usuario inactivo');
                    return (0, responses_1.error)({ req, res, body: "Token no válido - Usuario inexistente/inactivo o token expirado", status: 401 });
                }
                req.body.userData = user.dataValues;
                next();
            }
            catch (error) {
                res.status(401).json({
                    error: true,
                    status: 401,
                    body: "Token no válido - Usuario inexistente/inactivo o token expirado"
                });
            }
        });
    }
    fieldsValidator(req, res, next) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return (0, responses_1.error)({ req, res, body: errors, status: 401 });
        }
        next();
    }
    roleValidator(...roles) {
        return (req, res, next) => {
            if (!req.body.userData) {
                return (0, responses_1.error)({
                    req,
                    res,
                    body: `Server error: Se requiere verificar el token antes de validar el rol.
                        Hable con el administrador del endpoint.`,
                    status: 500
                });
            }
            if (!roles.includes(req.body.userData.role)) {
                return (0, responses_1.error)({ req, res, body: `El servicio requiere uno de estos roles ${roles}`, status: 401 });
            }
            next();
        };
    }
}
exports.SharedMW = SharedMW;
