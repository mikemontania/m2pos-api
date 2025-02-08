const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoria-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

// Rutas para Venta


 
router.get('/:page/:pageSize/:fechaDesde/:fechaHasta/:searchTerm?', validarJWT,   auditoriaController.getListPaginado);
 
router.delete('/:id', validarJWT,   auditoriaController.deletebyId);

module.exports = router;
