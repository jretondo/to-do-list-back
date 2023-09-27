
const { Router } = require('express');
const { check } = require('express-validator');
const { emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const {
    validarCampos,
    validarJWT,
    tieneRol
} = require('../middlewares');

const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROL'),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol', 'No es un rol válido').isIn(['ADMIN_ROL', 'USER_ROL']),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN_ROL'),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

module.exports = router;