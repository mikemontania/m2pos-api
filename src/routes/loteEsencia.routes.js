// routes/loteEsencia.routes.js
const express = require('express');
const router = express.Router();
const loteEsenciaController = require('../controllers/loteEsencia.controller'); 
const { validarJWT } = require('../middlewares/validar-jwt');


router.post('/', validarJWT, loteEsenciaController.crear);
router.get('/', validarJWT, loteEsenciaController.listar);
router.get('/:id', validarJWT, loteEsenciaController.obtenerPorId);
router.put('/:id', validarJWT, loteEsenciaController.actualizar);
router.delete('/:id', validarJWT, loteEsenciaController.eliminar);

module.exports = router;
