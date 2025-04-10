const { Router } = require('express');
const condicionPagoController = require('../controllers/condicionPago-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
router.get('/predeterminado', validarJWT,  condicionPagoController.findPredeterminado);

// Ruta para buscar una lista de precio por ID
router.get('/:id', validarJWT,   condicionPagoController.getById);

// Ruta para buscar todas las listas de precio
router.get('/', validarJWT,    condicionPagoController.findAll);

// Ruta para crear una nueva lista de precio
router.post('/', validarJWT,   condicionPagoController.create);

// Ruta para actualizar una lista de precio por ID
router.put('/:id', validarJWT,   condicionPagoController.update);

// Ruta para desactivar una lista de precio por ID
router.put('/desactivar/:id', validarJWT,   condicionPagoController.disable);

module.exports = router;
