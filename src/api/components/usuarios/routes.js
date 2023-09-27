
const { Router } = require('express');
const { check } = require('express-validator');
const { emailExiste, existeUsuarioPorId } = require('../../../helpers/db-validators');
const {
    validarCampos,
    validarJWT,
    tieneRol
} = require('../../../middlewares');

const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
} = require('./index');
const { success } = require('../../../network/response');

const router = Router();

router

    .get('/', (req, res, next) => usuariosGet().then((data) => success({ req, res, body: data })).catch(next))

    .post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe de ser más de 6 digitos').isLength({ min: 6 }),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom(emailExiste),
        check('rol', 'No es un rol válido').isIn(['ADMIN_ROL', 'USER_ROL']),
        validarCampos
    ], (req, res, next) => usuariosPost(req).then(body => success({ req, res, status: 201, body })).catch(next))

    .put('/:id', [
        validarJWT,
        tieneRol('ADMIN_ROL'),
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