
const { Router } = require('express');
const { check, body } = require('express-validator');
const { emailExiste, existeUsuarioPorId } = require('../../../helpers/db-validators');
const {
    validarCampos,
    validarJWT,
    tieneRol
} = require('../../../middlewares');

const { tareasPost, tareasGet, tareaGet } = require('./index');
const { success, error } = require('../../../network/response');

const router = Router();


router
    .get('/', validarJWT,
        check('rol', 'No es un rol válido').isIn(['ADMIN_ROL', 'USER_ROL']),
        validarCampos,
        (req, res, next) => tareasGet(req).then(body => success({ req, res, body })).catch(next))
    .get('/:id', validarJWT,
        check('rol', 'No es un rol válido').isIn(['ADMIN_ROL', 'USER_ROL']),
        validarCampos,
        (req, res, next) => tareaGet(req).then(body => success({ req, res, body })).catch(next))
    .post('/', validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
        tieneRol('ADMIN_ROL', 'USER_ROL'),
        validarCampos,
        (req, res, next) => tareasPost(req)
            .then(body => success({ req, res, body })).catch(next))

module.exports = router;