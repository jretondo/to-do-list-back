import { NextFunction, Request, Response } from "express";
import Task from "./tasks.model";
import { success } from "../../../network/responses";
import { Op } from "sequelize";
import User from "../users/user.model";

export class UserController {

    async getTasks(req: Request, res: Response, next: NextFunction) {
        (async function (req: Request) {

            const {
                searchedWord,
                completed,
                user_id
            } = req.query

            const { page } = req.params

            let id_user = user_id
            req.body.userData.role == "USER_ROL" && (id_user = req.body.userData.id)

            let completedBool = true
            String(completed) === "false" && (completedBool = false)
            String(completed) === "undefined" && (completedBool = false)
            String(completed) === "true" && (completedBool = true)

            if (page) {
                const ITEMS_PER_PAGE = 10;
                const OFFSET = (Number(page) - 1) * (ITEMS_PER_PAGE);
                const { count, rows } = await Task.findAndCountAll({
                    where: ((searchedWord || id_user || completed) ? [{
                        [Op.and]: [
                            [searchedWord ? { name: { [Op.like]: `%${searchedWord}%` } } : {}],
                            [searchedWord ? { description: searchedWord && { [Op.like]: `%${searchedWord}%` } } : {}],
                            [String(completed) !== "undefined" ? { completed: Boolean(completedBool) } : {}],
                            [id_user ? { user_id: Number(id_user) } : {}]
                        ]
                    }] : {}),
                    offset: OFFSET,
                    limit: ITEMS_PER_PAGE,
                    order: [["id", "DESC"]],
                    include: [{
                        model: User,
                        attributes: { exclude: ["password", "estado"] }
                    }]
                })
                return ({
                    totalItems: count ? count : 0,
                    itemsPerPage: ITEMS_PER_PAGE,
                    showedItems: rows ? rows : []
                })
            } else {
                return await Task.findAll({
                    where: ((searchedWord || id_user || completed) ? [{
                        [Op.and]: [
                            [searchedWord ? { name: { [Op.like]: `%${searchedWord}%` } } : {}],
                            [searchedWord ? { description: searchedWord && { [Op.like]: `%${searchedWord}%` } } : {}],
                            [completed ? { completed: Boolean(completed) } : {}],
                            [id_user ? { user_id: Number(id_user) } : {}]
                        ]
                    }] : {}),
                    order: [["id", "DESC"]],
                    include: [{
                        model: User,
                        attributes: { exclude: ["password", "estado"] }
                    }]
                })
            }
        })(req).then(body => success({ req, res, body })).catch(next)
    }

    async getTask(req: Request, res: Response, next: NextFunction) {
        (async function (req: Request) {
            const { id } = req.params;

            return await Task.findByPk(id)
        })(req).then(body => success({ req, res, body })).catch(next)
    }

    async createTask(req: Request, res: Response, next: NextFunction) {
        (async function (req: Request) {
            const { name, description } = req.body;
            const { id } = req.body.userData;
            const task = await Task.create({ name, description, user_id: id, completed: false });

            return ({
                id: task.dataValues.id,
                name: task.dataValues.name,
                description: task.dataValues.description
            });
        })(req).then(body => success({ req, res, body, status: 201 })).catch(next)
    }

    async updateTask(req: Request, res: Response, next: NextFunction) {
        (async function (req: Request) {
            const { id } = req.params;
            const { userData, ...taskData } = req.body;
            const task = await Task.update(taskData, { where: { id } })
            if (task.length > 0) {
                return "Modificado éxitosamente!"
            } else {
                throw Error("Error interno")
            }
        })(req).then(body => success({ req, res, body })).catch(next)
    }

    async deleteTask(req: Request, res: Response, next: NextFunction) {
        (async function (req: Request) {
            const { id } = req.params;
            const task = await Task.destroy({ where: { id } });

            if (task > 0) {
                return "Eliminado éxitosamente!"
            } else {
                throw Error("Error interno")
            }
        })(req).then(body => success({ req, res, body })).catch(next)
    }

    async toggleTask(req: Request, res: Response, next: NextFunction) {
        (async function (req: Request) {
            const { id } = req.params;

            const task = await Task.findByPk(id);

            if (task) {
                task.dataValues.completed = !task.dataValues.completed;
                await task.save();
                return "Modificado éxitosamente!"
            } else {
                throw Error("Server error: No se pudo modificar la tarea. Hable con el administrador del endpoint.")
            }
        })(req).then(body => success({ req, res, body })).catch(next)
    }
}