const { request } = require('express');

const Tarea = require("../../../models/tarea");
const { Op } = require('sequelize');

module.exports = () => {

    const tareasGet = async (req = request) => {
        const {
            pagina = 1,
            palabraBuscada,
            completada,
            usuario_id
        } = req.query

        const ITEMS_PER_PAGE = 10;
        const OFFSET = (pagina - 1) * (ITEMS_PER_PAGE);
        console.log('OFFSET :>> ', OFFSET);
        console.log('pagina :>> ', pagina);
        const { count, rows } = await Tarea.findAndCountAll({
            where: ((palabraBuscada || usuario_id || completada) ? {
                [Op.or]: [
                    palabraBuscada && { nombre: { [Op.like]: `%${palabraBuscada}%` } },
                    palabraBuscada && { descripcion: { [Op.like]: `%${palabraBuscada}%` } },
                    completada && { completada },
                    usuario_id && { usuario_id }
                ]
            } : {}),
            offset: OFFSET,
            limit: ITEMS_PER_PAGE
        })
        return ({
            totalItems: count ? count : 0,
            itemsPerPage: ITEMS_PER_PAGE,
            showedItems: rows ? rows : 0
        })
    }

    const tareasPost = async (req = request) => {
        const { nombre, descripcion } = req.body
        const { id } = req.usuario
        return await Tarea.create({ nombre, descripcion, usuario_id: id })
    }

    return {
        tareasGet,
        tareasPost
    }
}