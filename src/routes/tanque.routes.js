// routes/tanque-fermentador.routes.js
const express = require('express');
const router = express.Router();
const tanqueController = require('../controllers/tanque.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

// Crear un nuevo tanque
router.post('/', validarJWT , tanqueController.crear);

// Listar tanques por empresa
router.get('/empresa/:empresaId', validarJWT , tanqueController.listar);

// Obtener un tanque por ID
router.get('/:id', validarJWT , tanqueController.obtenerPorId);

// Actualizar un tanque
router.put('/:id', validarJWT , tanqueController.actualizar);

// Desactivar un tanque
router.delete('/:id', validarJWT , tanqueController.eliminar);

module.exports = router;