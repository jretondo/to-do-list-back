const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const { error } = require('../network/response');

const Usuario = require('../models/usuario');


const validarJWT = async (req, res, next) => {

    const token = req.header('authorization');

    if (!token) {
        return error({ req, res, body: "Token no válido", status: 401 })
    }

    try {
        const { userData } = jwt.verify(token, process.env.SECRET_KEY);
        const usuario = await Usuario.findByPk(userData.id);

        if (!usuario) {
            console.log('Usuario no existe en la BD');
            return error({ req, res, body: "Token no válido", status: 401 })
        }

        if (!usuario.estado) {
            console.log('Usuario inactivo');
            return error({ req, res, body: "Token no válido", status: 401 })
        }

        req.usuario = usuario.dataValues;
        next();

    } catch (error) {
        res.status(401).json({
            error: true,
            status: 401,
            body: "Token no valido"
        })
    }
}

module.exports = {
    validarJWT
}