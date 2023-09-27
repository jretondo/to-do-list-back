const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');
const { error } = require('../network/response');


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('authorization');

    if (!token) {
        return error({ req, res, body: 'No hay token en la petición', status: 401 })
    }

    try {
        const { userData } = jwt.verify(token, process.env.SECRET_KEY);
        const usuario = await Usuario.findByPk(userData.id);

        if (!usuario) {
            console.log('Usuario no existe en la BD');
            return error({ req, res, body: 'Token no valido', status: 401 })
        }

        if (!usuario.estado) {
            console.log('Usuario inactivo');
            return error({ req, res, body: 'Token no valido', status: 401 })
        }

        req.usuario = usuario.dataValues;
        next();

    } catch (error) {
        console.log(error);
        return error({ req, res, body: 'Token no valido', status: 401 })
    }
}

module.exports = {
    validarJWT
}