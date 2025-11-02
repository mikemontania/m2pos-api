// routes/tanque-fermentador.routes.js
const express = require('express');
const router = express.Router();
const tanqueFermentadorController = require('../controllers/tanque-fermentador.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

// Crear un nuevo tanque
router.post('/', validarJWT , tanqueFermentadorController.crear);

// Listar tanques por empresa
router.get('/empresa/:empresaId', validarJWT , tanqueFermentadorController.listar);

// Obtener un tanque por ID
router.get('/:id', validarJWT , tanqueFermentadorController.obtenerPorId);

// Actualizar un tanque
router.put('/:id', validarJWT , tanqueFermentadorController.actualizar);

// Desactivar un tanque
router.delete('/:id', validarJWT , tanqueFermentadorController.eliminar);

module.exports = router;