const Tarea = require("../../../models/tarea");
const { Op } = require('sequelize');
const { Usuario } = require('../../../models');

module.exports = () => {
    const tareasGet = async (req) => {
        const {
            pagina,
            palabraBuscada,
            completada,
            usuario_id
        } = req.query
        console.log('req.usuario :>> ', req.usuario);
        let id_ususario = usuario_id
        if (req.usuario.rol == "USER_ROL") {
            id_ususario = req.usuario.id
        }
        console.log('id_ususario :>> ', id_ususario);
        if (pagina) {
            const ITEMS_PER_PAGE = 10;
            const OFFSET = (pagina - 1) * (ITEMS_PER_PAGE);
            const { count, rows } = await Tarea.findAndCountAll({
                where: ((palabraBuscada || id_ususario || completada) ? {
                    [Op.and]: [
                        palabraBuscada && { nombre: { [Op.like]: `%${palabraBuscada}%` } },
                        palabraBuscada && { descripcion: { [Op.like]: `%${palabraBuscada}%` } },
                        completada && { completada },
                        id_ususario && { usuario_id: id_ususario }
                    ]
                } : {}),
                offset: OFFSET,
                limit: ITEMS_PER_PAGE,
                order: [["id", "DESC"]],
                include: [{
                    model: Usuario,
                    attributes: { exclude: ["password", "estado"] }
                }]
            })
            return ({
                totalItems: count ? count : 0,
                itemsPerPage: ITEMS_PER_PAGE,
                showedItems: rows ? rows : 0
            })
        } else {
            return await Tarea.findAll({
                where: ((palabraBuscada || id_ususario || completada) ? {
                    [Op.and]: [
                        palabraBuscada && { nombre: { [Op.like]: `%${palabraBuscada}%` } },
                        palabraBuscada && { descripcion: { [Op.like]: `%${palabraBuscada}%` } },
                        completada && { completada },
                        id_ususario && { usuario_id: id_ususario }
                    ]
                } : {}),
                order: [["id", "DESC"]],
                include: [{
                    model: Usuario,
                    attributes: { exclude: ["password", "estado"] }
                }]
            })
        }
    }

    const tareasPost = async (req) => {
        const { nombre, descripcion } = req.body
        const { id } = req.usuario
        return await Tarea.create({ nombre, descripcion, usuario_id: id })
    }

    const tareaGet = async (req) => {
        const { id } = req.params
        return await Tarea.findByPk(id, {
            include: [{
                model: Usuario,
                attributes: { exclude: ["password", "estado"] }
            }]
        })
    }

    const tareaPut = async (req) => {
        const { id } = req.params;
        const { usuario, ...tareaData } = req.body;
        const tarea = await Tarea.update(tareaData, { where: { id } })
        if (tarea.length > 0) {
            return "Modificado éxitosamente!"
        } else {
            throw Error("Error interno")
        }
    }

    const tareaDelete = async (req) => {
        const { id } = req.params;
        const tarea = await Tarea.destroy({ where: { id } });

        if (tarea > 0) {
            return "Eliminado éxitosamente!"
        } else {
            throw Error("Error interno")
        }
    }

    return {
        tareasGet,
        tareasPost,
        tareaGet,
        tareaPut,
        tareaDelete
    }
}