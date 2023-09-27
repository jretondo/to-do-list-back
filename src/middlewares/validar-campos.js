const { validationResult } = require('express-validator');
const { error } = require('../network/response');

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return error({ req, res, body: errors, status: 401 })
    }
    next();
}

module.exports = {
    validarCampos
}
