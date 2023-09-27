const { response } = require('express')

const tieneRol = (...roles) => {
    return (req, res = response, next) => {
        console.log('Se requiere verificar el token primero')
        if (!req.usuario) {
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