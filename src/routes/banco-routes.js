const { Router } = require('express');
const bancoController = require('../controllers/banco-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar una categoría por ID
router.get('/:id', validarJWT, bancoController.getById);

// Ruta para buscar todas las categorías
router.get('/', validarJWT, bancoController.findAll);

// Ruta para crear una nueva categoría
router.post('/', validarJWT, bancoController.create);

// Ruta para actualizar una categoría por ID
router.put('/:id', validarJWT, bancoController.update);

// Ruta para desactivar una categoría por ID
router.put('/desactivar/:id', validarJWT, bancoController.disable);

module.exports = router;
