
const { Router } = require('express');
const { check } = require('express-validator');
const { success } = require('../../../network/response');

const {
    validarCampos,
    validarJWT,
    tieneRol
} = require('../../../middlewares');

const {
    emailExiste,
    existeUsuarioPorId,
    noExistenUsuarios
} = require('../../../helpers/db-validators');

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuarioGet
} = require('./index');

const router = Router();

router

    .get('/', (req, res, next) => usuariosGet().then((data) => success({ req, res, body: data })).catch(next))

    .get('/:id', [
        validarJWT,
        tieneRol('ADMIN_ROL'),
        check('id').custom(existeUsuarioPorId),
        validarCampos
    ], (req, res, next) => usuarioGet(req).then(body => success({ req, res, body })).catch(next))

    .post('/primer', [
        check('correo').custom(noExistenUsuarios),
        check('nombre', 'El nombre debe tener una longitud de 5 caracteres').isLength({ min: 5 }),
        check('password', 'El password debe de ser más de 6 digitos').isLength({ min: 6 }),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom(emailExiste),
        check('rol', 'No es un rol válido').isIn(['ADMIN_ROL']),
        validarCampos
    ], (req, res, next) => usuariosPost(req).then(body => success({ req, res, status: 201, body })).catch(next))

    .post('/', [
        validarJWT,
        tieneRol('ADMIN_ROL'),
        check('nombre', 'El nombre debe tener una longitud de 5 caracteres').isLength({ min: 5 }),
        check('password', 'El password debe de ser más de 6 digitos').isLength({ min: 6 }),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom(emailExiste),
        check('rol', 'No es un rol válido').isIn(['USER_ROL', 'ADMIN_ROL']),
        validarCampos
    ], (req, res, next) => usuariosPost(req).then(body => success({ req, res, status: 201, body })).catch(next))

    .put('/:id', [
        validarJWT,
        tieneRol('ADMIN_ROL'),
        check('nombre', 'El nombre debe tener una longitud de 5 caracteres')
            .if(check('nombre').notEmpty()).isLength({ min: 5 }),
        check('password', 'El password debe de ser más de 6 digitos')
            .if(check('password').notEmpty()).isLength({ min: 6 }),
        check('rol', 'No es un rol válido')
            .if(check('rol').notEmpty()).isIn(['ADMIN_ROL', 'USER_ROL']),
        check('id').custom(existeUsuarioPorId),
        validarCampos
    ], (req, res, next) => usuariosPut(req).then(body => success({ req, res, body })).catch(next))

    .delete('/:id', [
        validarJWT,
        tieneRol('ADMIN_ROL'),
        check('id').custom(existeUsuarioPorId),
        validarCampos
    ], (req, res, next) => usuariosDelete(req).then(body => success({ req, res, body })).catch(next))

module.exports = router;