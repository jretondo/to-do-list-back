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

const noExistenUsuarios = async () => {
    const existenUsuarios = await Usuario.findAll();
    if (existenUsuarios.length > 0) {
        throw new Error(`Ya existen usuarios registrado!`);
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findByPk(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

const existeTareaPorId = async (id) => {
    const existeTarea = await Tarea.findByPk(id);
    if (!existeTarea) {
        throw new Error(`El id ${id} no existe`);
    }
}

module.exports = {
    emailExiste,
    existeUsuarioPorId,
    emailNoExiste,
    existeTareaPorId,
    noExistenUsuarios
}

