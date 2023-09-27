const bcryptjs = require('bcryptjs');
const Usuario = require('../../../models/usuario');

module.exports = () => {
    const usuariosGet = async () => {
        return await Usuario.findAll({
            attributes: { exclude: ["password"] }
        })
    }

    const usuariosPost = async (req) => {
        const { nombre, correo, password, rol } = req.body;
        const usuario = await Usuario.create({ nombre, correo, password, rol });

        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        await usuario.save();

        return ({
            id: usuario.dataValues.id,
            nombre,
            correo,
            rol
        });
    }

    const usuariosPut = async (req) => {
        const { id } = req.params;
        const { correo, ...usuarioData } = req.body;
        if (usuarioData.password) {
            const salt = bcryptjs.genSaltSync();
            usuarioData.password = bcryptjs.hashSync(usuarioData.password, salt);
        }

        const usuario = await Usuario.update(usuarioData, { where: { id } });

        if (usuario.length > 0) {
            return "Modificado éxitosamente!"
        } else {
            throw Error("Error interno")
        }
    }

    const usuariosDelete = async (req) => {
        const { id } = req.params;
        const usuario = await Usuario.destroy({ where: { id } });

        if (usuario > 0) {
            return "Eliminado éxitosamente!"
        } else {
            throw Error("Error interno")
        }
    }

    return {
        usuariosGet,
        usuariosPost,
        usuariosPut,
        usuariosDelete,
    }
}