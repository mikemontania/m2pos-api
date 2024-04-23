const { Router } = require('express');
const listaPrecioController = require('../controllers/listaPrecio-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();
router.get('/predeterminado', validarJWT,  listaPrecioController.findPredeterminado);

// Ruta para buscar una lista de precio por ID
router.get('/:id', validarJWT,   listaPrecioController.getById);

// Ruta para buscar todas las listas de precio
router.get('/', validarJWT,    listaPrecioController.findAll);

// Ruta para crear una nueva lista de precio
router.post('/', validarJWT,  auditMiddleware, listaPrecioController.create);

// Ruta para actualizar una lista de precio por ID
router.put('/:id', validarJWT,  auditMiddleware, listaPrecioController.update);

// Ruta para desactivar una lista de precio por ID
router.put('/desactivar/:id', validarJWT,  auditMiddleware, listaPrecioController.disable);

module.exports = router;
