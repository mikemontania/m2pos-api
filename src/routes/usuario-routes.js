const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt')
const usuarioController = require('../controllers/usuario-controller.js');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();
/*
RUTA  /api/usuarios
*/
router.get('/',validarJWT,    usuarioController.findAll);
router.get('/:id',validarJWT,   usuarioController.getById);
router.get('/paginados/:page/:pageSize/:searchTerm?', validarJWT,  usuarioController.findPaginados);

router.put('/:id',
    [ validarJWT,  
        check('id', 'El id es obligatorio').not().isEmpty(),
        check('username', 'El username es obligatorio').isEmail(), 
        check('usuario', 'El usuario es obligatorio').not().isEmpty(),
        validarCampos
    ], usuarioController.update);
router.post('/',
    [ validarJWT,  
        check('username', 'El username es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('usuario', 'El usuario es obligatorio').not().isEmpty(),
        validarCampos
    ], usuarioController.create);
router.delete('/:id/disable',validarJWT,    usuarioController.disable);
module.exports = router;
