const { Router } = require('express');
const productoController = require('../controllers/producto-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar un producto por ID
router.get('/producto/:id', validarJWT, productoController.getById);

// Ruta para buscar todos los productos
router.get('/productos', validarJWT, productoController.findAll);

// Ruta para crear un nuevo producto
router.post('/producto', validarJWT, productoController.create);

// Ruta para actualizar un producto por ID
router.put('/producto/:id', validarJWT, productoController.update);

// Ruta para desactivar un producto (marcar como inactivo)
router.delete('/producto/:id', validarJWT, productoController.disable);

module.exports = router;
