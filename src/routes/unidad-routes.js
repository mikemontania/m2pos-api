const express = require('express');
const router = express.Router();
const unidadController = require('../controllers/unidad-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
// Rutas para Unidad con validación de JWT
router.get('/:id', validarJWT,   unidadController.getById);
router.get('/', validarJWT,   unidadController.findAll);
router.post('/', validarJWT,   unidadController.create);
router.put('/:id', validarJWT,   unidadController.update);
router.patch('/:id/disable', validarJWT,   unidadController.disable);

module.exports = router;
