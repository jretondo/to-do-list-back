const { response, request } = require('express');

const Tarea = require("../../models/tarea");
const { Op } = require('sequelize');

const tareasGet = async (req = request, res = response) => {
    const {
        pagina = 1,
        palabraBuscada,
        completada,
        usuario_id
    } = req.query

    const ITEMS_PER_PAGE = 10;
    const OFFSET = (pagina - 1) * (ITEMS_PER_PAGE);
    const { count, rows } = await Tarea.findAll({
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

    res.json({
        totalItems: count ? count : 0,
        itemsPerPage: ITEMS_PER_PAGE,
        showedItems: rows ? rows : 0
    })
}

const tareasPost = async (req = request, res = response) => {
    const { nombre, descripcion } = req.body
    const { id } = req.usuario

    const tarea = await Tarea.create({ nombre, descripcion, usuario_id: id })
    throw Error("fijate que onda")
    if (tarea.dataValues.id) {
        res.status(201).json(tarea.dataValues);
    } else {
        res.status(500).json({
            msg: "Hubo un error interno"
        })
    }
}

module.exports = {
    tareasGet,
    tareasPost
}