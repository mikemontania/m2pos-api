const { Router } = require('express');
const categoriaController = require('../controllers/categoria-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar una categoría por ID
router.get('/:id', validarJWT, categoriaController.getById);

// Ruta para buscar todas las categorías
router.get('/', validarJWT, categoriaController.findAll);

// Ruta para crear una nueva categoría
router.post('/', validarJWT, categoriaController.create);

// Ruta para actualizar una categoría por ID
router.put('/:id', validarJWT, categoriaController.update);

// Ruta para desactivar una categoría por ID
router.put('/categoriadesactivar/:id', validarJWT, categoriaController.disable);

module.exports = router;
