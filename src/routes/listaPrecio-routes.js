const { Router } = require('express');
const listaPrecioController = require('../controllers/listaPrecio-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar una lista de precio por ID
router.get('/listaprecio/:id', validarJWT, listaPrecioController.getById);

// Ruta para buscar todas las listas de precio
router.get('/listasprecio', validarJWT, listaPrecioController.findAll);

// Ruta para crear una nueva lista de precio
router.post('/listaprecio', validarJWT, listaPrecioController.create);

// Ruta para actualizar una lista de precio por ID
router.put('/listaprecio/:id', validarJWT, listaPrecioController.update);

// Ruta para desactivar una lista de precio por ID
router.put('/listapreciodesactivar/:id', validarJWT, listaPrecioController.disable);

module.exports = router;
