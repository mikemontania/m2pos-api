// routes/esencia.routes.js
const express = require('express');
const router = express.Router();
const esenciaController = require('../controllers/esencia.controller');

const { validarJWT } = require('../middlewares/validar-jwt');
router.post('/', validarJWT, esenciaController.crear);
router.get('/', validarJWT, esenciaController.listar);
router.get('/:id', validarJWT, esenciaController.obtenerPorId);
router.put('/:id', validarJWT, esenciaController.actualizar);
router.delete('/:id', validarJWT, esenciaController.eliminar);

module.exports = router;