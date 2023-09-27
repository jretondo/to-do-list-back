const { Usuario, Tarea } = require('../models');

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ where: { correo } });
    if (existeEmail) {
        throw new Error(`El correo: ${correo}, ya está registrado`);
    }
}

const emailNoExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ where: { correo } });
    if (!existeEmail) {
        throw new Error(`El correo: ${correo}, no está registrado`);
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findByPk(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe ${id}`);
    }
}

const existeTareaPorId = async (id) => {
    const existeTarea = await Tarea.findByPk(id);
    if (!existeTarea) {
        throw new Error(`El id no existe ${id}`);
    }
}

module.exports = {
    emailExiste,
    existeUsuarioPorId,
    emailNoExiste,
    existeTareaPorId
}

