const { Router } = require('express');
const clienteController = require('../controllers/cliente-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar un cliente por ID
router.get('/cliente/:id', validarJWT, clienteController.getById);

// Ruta para buscar todos los clientes
router.get('/clientes', validarJWT, clienteController.findAll);

// Ruta para crear un nuevo cliente
router.post('/cliente', validarJWT, clienteController.create);

// Ruta para actualizar un cliente por ID
router.put('/cliente/:id', validarJWT, clienteController.update);

// Ruta para desactivar un cliente por ID
router.put('/clientedesactivar/:id', validarJWT, clienteController.disable);

module.exports = router;
