const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('authorization');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { userData } = jwt.verify(token, process.env.SECRET_KEY);
        const usuario = await Usuario.findByPk(userData.id);

        if (!usuario) {
            console.log('Usuario no existe en la BD');
            return res.status(401).json({
                msg: 'Token no válido'
            })
        }

        if (!usuario.estado) {
            console.log('Usuario inactivo');
            return res.status(401).json({
                msg: 'Token no válido'
            })
        }

        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validarJWT
}