
const { Router } = require('express');
const { check } = require('express-validator');
const { existeTareaPorId } = require('../../../helpers/db-validators');
const { success } = require('../../../network/response');

const {
    validarCampos,
    validarJWT,
    tieneRol
} = require('../../../middlewares');

const {
    tareasPost,
    tareasGet,
    tareaGet,
    tareaPut,
    tareaDelete
} = require('./index');

const router = Router();

router
    .get('/', validarJWT,
        tieneRol('ADMIN_ROL', 'USER_ROL'),
        validarCampos,
        (req, res, next) => tareasGet(req).then(body => success({ req, res, body })).catch(next))

    .get('/:id', validarJWT,
        tieneRol('ADMIN_ROL', 'USER_ROL'),
        validarCampos,
        (req, res, next) => tareaGet(req).then(body => success({ req, res, body })).catch(next))

    .post('/', validarJWT,
        tieneRol('ADMIN_ROL', 'USER_ROL'),
        check('nombre', 'El nombre debe contener un texto claro (no vacío)').isLength({ min: 5 }),
        check('descripcion', 'La descripción no debe tener una longitud menor a 15 caracteres').isLength({ min: 15 }),
        validarCampos,
        (req, res, next) => tareasPost(req)
            .then(body => success({ req, res, body, status: 201 })).catch(next))

    .put('/:id', validarJWT,
        tieneRol('ADMIN_ROL', 'USER_ROL'),
        check('id').custom(existeTareaPorId),
        check('nombre', 'El nombre debe contener un texto claro (no vacío)')
            .if(check("nombre").notEmpty()).isLength({ min: 5 }),
        check('descripcion', 'La descripción no debe tener una longitud menor a 15 caracteres')
            .if(check("descripcion").notEmpty()).isLength({ min: 15 }),
        validarCampos,
        (req, res, next) => tareaPut(req).then(body => success({ req, res, body })).catch(next))

    .delete('/:id', validarJWT,
        tieneRol('ADMIN_ROL'),
        check('id').custom(existeTareaPorId),
        validarCampos,
        (req, res, next) => tareaDelete(req).then(body => success({ req, res, body })).catch(next))

module.exports = router;