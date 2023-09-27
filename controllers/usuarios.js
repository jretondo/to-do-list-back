const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../../models/usuario');

const usuariosGet = async (req = request, res = response) => {
    const usuarios = await Usuario.findAll({
        attributes: {
            exclude: ["password"]
        }
    })
    res.json({
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = await Usuario.create({ nombre, correo, password, rol });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.status(201).json({
        id: usuario.dataValues.id,
        nombre,
        correo,
        rol
    });
}

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { correo, ...resto } = req.body;
    if (resto.password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(resto.password, salt);
    }

    const usuario = await Usuario.update(resto, { where: { id } });

    if (usuario.length > 0) {
        res.json({
            msg: "Modificado éxitosamente!"
        });
    } else {
        res.status(500).json({
            msg: "Hubo un error interno"
        })
    }
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;
    const usuario = await Usuario.destroy({ where: { id } });

    if (usuario > 0) {
        res.json({
            msg: "Eliminado éxitosamente!"
        });
    } else {
        res.status(500).json({
            msg: "Hubo un error interno"
        })
    }
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
}