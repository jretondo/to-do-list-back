import { NextFunction, Request, Response } from "express";
import User from "./user.model";
import bcryptjs from 'bcryptjs';
import { TABLES } from "../../../common/tables";
import { success } from "../../../network/responses";

export class UserController {

    async getUsers(req: Request, res: Response, next: NextFunction) {
        (async function () {
            return await User.findAll({
                attributes: { exclude: [TABLES.users.columns.password] }
            })
        })().then(body => success({ req, res, body })).catch(next)
    }

    async getUser(req: Request, res: Response, next: NextFunction) {
        (async function (req: Request) {
            const { id } = req.params;
            return await User.findByPk(id, {
                attributes: { exclude: [TABLES.users.columns.password] }
            })
        })(req).then(body => success({ req, res, body })).catch(next)
    }


    async createUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        (async function (req: Request) {
            const { name, email, role, password } = req.body;
            const salt = bcryptjs.genSaltSync();
            const newUser = {
                name,
                email,
                password: bcryptjs.hashSync(password, salt),
                role
            }
            const user = await User.create(newUser);
            user.save();

            return ({
                id: user.dataValues.id,
                name: user.dataValues.name,
                email: user.dataValues.email,
                role: user.dataValues.role
            });
        })(req).then(body => success({ req, res, body, status: 201 })).catch(next)
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        (async function (req: Request) {
            const { id } = req.params;
            const { email, ...userData } = req.body;

            if (userData.password) {
                const salt = bcryptjs.genSaltSync();
                userData.password = bcryptjs.hashSync(userData.password, salt);
            }

            const user = await User.update(userData, { where: { id } });

            if (user.length > 0) {
                return "Modificado éxitosamente!"
            } else {
                throw Error("Server error: No se pudo modificar el usuario. Hable con el administrador del endpoint.")
            }
        })(req).then(body => success({ req, res, body })).catch(next)
    }

    async disabledUser(req: Request, res: Response, next: NextFunction) {
        (async function (req: Request) {
            const { id } = req.params;

            const user = await User.update({ state: false }, { where: { id } });

            if (user.length > 0) {
                return "Eliminado éxitosamente!"
            } else {
                throw Error("Server error: No se pudo eliminar el usuario. Hable con el administrador del endpoint.")
            }
        })(req).then(body => success({ req, res, body })).catch(next)
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        (async function (req: Request) {
            const { id } = req.params;

            const user = await User.destroy({ where: { id } });

            if (user > 0) {
                return "Eliminado éxitosamente!"
            } else {
                throw Error("Server error: No se pudo eliminar el usuario. Hable con el administrador del endpoint.")
            }
        })(req).then(body => success({ req, res, body })).catch(next)
    }
}