import { DecodedToken } from '../common/interfaces';
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { error } from "../network/responses";
import User from "../api/components/users/user.model";
import { validationResult } from 'express-validator';

export class SharedMW {

    async verifyToken(req: Request, res: Response, next: NextFunction) {
        const token = req.header('authorization');
        if (!token) {
            return error({ req, res, body: "No se envió ningún token - Para esta consulta es necesario un token valido", status: 401 })
        }

        try {
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY || 'secret') as DecodedToken;
            const user = await User.findByPk(decodedToken.id);

            if (!user?.dataValues.id) {
                console.log('Usuario no existe en la BD');
                return error({ req, res, body: "Token no válido - Usuario inexistente/inactivo o token expirado", status: 401 })
            }

            if (!user.dataValues.state) {
                console.log('Usuario inactivo');
                return error({ req, res, body: "Token no válido - Usuario inexistente/inactivo o token expirado", status: 401 })
            }

            req.body.userData = user.dataValues;
            next();

        } catch (error) {
            res.status(401).json({
                error: true,
                status: 401,
                body: "Token no válido - Usuario inexistente/inactivo o token expirado"
            })
        }
    }

    fieldsValidator(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return error({ req, res, body: errors, status: 401 })
        }
        next();
    }

    roleValidator(...roles: Array<string>) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.body.userData) {
                return error({
                    req,
                    res,
                    body:
                        `Server error: Se requiere verificar el token antes de validar el rol.
                        Hable con el administrador del endpoint.`,
                    status: 500
                })
            }
            if (!roles.includes(req.body.userData.role)) {
                return error({ req, res, body: `El servicio requiere uno de estos roles ${roles}`, status: 401 })
            }

            next();
        }
    }
}