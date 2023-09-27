const { response } = require('express')
const { error } = require('../network/response')

const tieneRol = (...roles) => {
    return (req, res = response, next) => {
        if (!req.usuario) {
            console.log('Se requiere verificar el token primero')
            return error({ req, res, body: `Error interno - hablar con el administrador`, status: 500 })
        }
        if (!roles.includes(req.usuario.rol)) {
            return error({ req, res, body: `El servicio requiere uno de estos roles ${roles}`, status: 401 })
        }

        next();
    }
}

module.exports = {
    tieneRol
}