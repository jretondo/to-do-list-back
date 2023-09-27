
const { Router } = require('express');
const { check } = require('express-validator');
const { emailExiste, existeUsuarioPorId } = require('../../../helpers/db-validators');
const {
    validarCampos,
    validarJWT,
    tieneRol
} = require('../../../middlewares');

const { tareasPost, tareasGet } = require('./index');
const { success, error } = require('../../../network/response');

const router = Router();


router
    .get('/', validarJWT,
        (req, res, next) => tareasGet(req).then(body => success({ req, res, body })).catch(next))
    .post('/', validarJWT,
        (req, res, next) => tareasPost(req)
            .then(data => success({ req, res, body: data })).catch(next))

module.exports = router;