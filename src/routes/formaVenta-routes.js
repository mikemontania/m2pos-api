const { Router } = require('express');
const formaVentaController = require('../controllers/formaVenta-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
router.get('/predeterminado', validarJWT,  formaVentaController.findPredeterminado);

// Ruta para buscar una lista de precio por ID
router.get('/:id', validarJWT,   formaVentaController.getById);

// Ruta para buscar todas las listas de precio
router.get('/', validarJWT,    formaVentaController.findAll);

// Ruta para crear una nueva lista de precio
router.post('/', validarJWT,   formaVentaController.create);

// Ruta para actualizar una lista de precio por ID
router.put('/:id', validarJWT,   formaVentaController.update);

// Ruta para desactivar una lista de precio por ID
router.put('/desactivar/:id', validarJWT,   formaVentaController.disable);

module.exports = router;
