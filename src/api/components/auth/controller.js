const bcryptjs = require('bcryptjs');
const Usuario = require('../../../models/usuario');
const { generarJWT } = require('../../../helpers/generar-jwt');

module.exports = () => {
    const login = async (req) => {
        const { correo, password } = req.body;

        const usuario = await Usuario.findOne({ where: { correo } });

        if (!usuario) {
            console.log('No existe el correo');
            return false
        }

        if (!usuario.estado) {
            console.log('El usuario no está activo');
            return false
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            console.log('La contraseña es incorrecta');
            return false
        }

        const userData = {
            id: usuario.dataValues.id,
            nombre: usuario.dataValues.nombre,
            email: usuario.dataValues.email,
            rol: usuario.dataValues.rol
        }

        const token = await generarJWT(userData);

        return ({
            userData,
            token
        })
    }
    return {
        login
    }
}