const { Router } = require('express');
const bancoController = require('../controllers/banco-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();

// Ruta para buscar un banco por ID
router.get('/:id', validarJWT,   bancoController.getById);

// Ruta para buscar todos los bancos
router.get('/', validarJWT,   bancoController.findAll);

// Ruta para crear un banco
router.post('/', validarJWT,  auditMiddleware, bancoController.create);

// Ruta para actualizar un banco
router.put('/:id', validarJWT,  auditMiddleware, bancoController.update);

// Ruta para desactivar un banco
router.put('/desactivar/:id', validarJWT,  auditMiddleware, bancoController.disable);

module.exports = router;
