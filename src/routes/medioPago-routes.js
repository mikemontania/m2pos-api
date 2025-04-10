const { Router } = require('express');
const medioPagoController = require('../controllers/medioPago.controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar todas las categorías
router.get('/', validarJWT,   medioPagoController.findAll);

// Ruta para buscar una categoría predeterminada
router.get('/predeterminado', validarJWT,  medioPagoController.findPredeterminado);

// Ruta para buscar una categoría por ID
router.get('/:id', validarJWT,    medioPagoController.getById);

// Ruta para crear una nueva categoría
router.post('/', validarJWT,   medioPagoController.create);

// Ruta para actualizar una categoría por ID
router.put('/:id', validarJWT,   medioPagoController.update);

// Ruta para desactivar una categoría por ID
router.put('/desactivar/:id', validarJWT,   medioPagoController.disable);

module.exports = router;
