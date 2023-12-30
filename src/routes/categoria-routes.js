const { Router } = require('express');
const categoriaController = require('../controllers/categoria-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar una categoría por ID
router.get('/categoria/:id', validarJWT, categoriaController.getById);

// Ruta para buscar todas las categorías
router.get('/categorias', validarJWT, categoriaController.findAll);

// Ruta para crear una nueva categoría
router.post('/categoria', validarJWT, categoriaController.create);

// Ruta para actualizar una categoría por ID
router.put('/categoria/:id', validarJWT, categoriaController.update);

// Ruta para desactivar una categoría por ID
router.put('/categoriadesactivar/:id', validarJWT, categoriaController.disable);

module.exports = router;
