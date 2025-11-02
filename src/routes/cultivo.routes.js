const express = require('express');
const router = express.Router();
const cultivoController = require('../controllers/cultivo.controller');

// ✅ Middleware de autenticación (si lo usás en tu app)
const { validarJWT } = require('../middlewares/validar-jwt');

 
// Crear un nuevo cultivo
router.post('/', validarJWT,cultivoController.crear);

// Listar cultivos (con filtros opcionales ?activo=true/false)
router.get('/',  validarJWT,cultivoController.listar);

// Obtener un cultivo por ID
router.get('/:id',  validarJWT,cultivoController.obtenerPorId);

// Actualizar un cultivo por ID
router.put('/:id',  validarJWT,cultivoController.actualizar);

// Desactivar (eliminación lógica) un cultivo por ID
router.delete('/:id', validarJWT, cultivoController.eliminar);

module.exports = router;
