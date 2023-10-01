import { NextFunction, Request, Response } from "express";
import bcryptjs from 'bcryptjs';
import User from "../users/user.model";
import JWT_Generator from "../../../helpers/jwt-generator";
import { success } from "../../../network/responses";

export class UserController {
    async login(req: Request, res: Response, next: NextFunction) {
        (async function (req: Request) {

            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                console.log('No existe el correo');
                return false
            }

            if (!user.dataValues.email) {
                console.log('El usuario no está activo');
                return false
            }

            const validPassword = bcryptjs.compareSync(password, user.dataValues.password);
            if (!validPassword) {
                console.log('La contraseña es incorrecta');
                return false
            }

            const userData = {
                id: user.dataValues.id || 0,
                name: user.dataValues.name,
                email: user.dataValues.email,
                role: user.dataValues.role
            }

            const token = await JWT_Generator.generate(userData);

            return ({
                userData,
                token
            })
        })(req).then(body => success({ req, res, body })).catch(next)
    }

}