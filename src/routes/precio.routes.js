const { Router } = require('express');
const precioController = require('../controllers/precio-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar un precio por ID
router.get('/precio/:id', validarJWT, precioController.getById);

// Ruta para buscar todos los precios
router.get('/precios', validarJWT, precioController.findAll);

// Ruta para crear un nuevo precio
router.post('/precio', validarJWT, precioController.create);

// Ruta para actualizar un precio por ID
router.put('/precio/:id', validarJWT, precioController.update);

// Ruta para desactivar un precio (marcar como inactivo)
router.delete('/precio/:id', validarJWT, precioController.disable);

module.exports = router;
