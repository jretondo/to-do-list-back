const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../../../models/usuario');

const { generarJWT } = require('../../../helpers/generar-jwt');


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { correo } });

        if (!usuario) {
            console.log('No existe el correo');
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        if (!usuario.estado) {
            console.log('El usuario no está activo');
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            console.log('La contraseña es incorrecta');
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos'
            });
        }

        const userData = {
            id: usuario.dataValues.id,
            nombre: usuario.dataValues.nombre,
            email: usuario.dataValues.email,
            rol: usuario.dataValues.rol
        }

        const token = await generarJWT(userData);

        res.json({
            userData,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Error interno - hable con el administrador'
        });
    }
}


module.exports = {
    login
}