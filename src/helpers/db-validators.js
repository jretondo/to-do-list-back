const { Usuario } = require('../models');

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ where: { correo } });
    if (existeEmail) {
        throw new Error(`El correo: ${correo}, ya está registrado`);
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findByPk(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
}

module.exports = {
    emailExiste,
    existeUsuarioPorId
}

