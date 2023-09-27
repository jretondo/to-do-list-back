const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../../../middlewares');
const { login } = require('./index');
const { success, error } = require('../../../network/response');
const { emailNoExiste } = require('../../../helpers/db-validators');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
    check('correo').custom(emailNoExiste),
    validarCampos
], (req, res, next) => login(req).then(body => {
    body ? success({ req, res, body }) :
        error({ req, res, body: "Usuario / Contraseña no son correctos", status: 400 })
}).catch(next));

module.exports = router;