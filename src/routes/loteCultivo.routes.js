// routes/loteCultivo.routes.js
const express = require('express');
const router = express.Router();
const loteCultivoController = require('../controllers/loteCultivo.controller');

const { validarJWT } = require('../middlewares/validar-jwt');


router.post('/', validarJWT , loteCultivoController.crear);
router.get('/', validarJWT , loteCultivoController.listar);
router.get('/:id', validarJWT , loteCultivoController.obtenerPorId);
router.put('/:id', validarJWT , loteCultivoController.actualizar);
router.delete('/:id', validarJWT , loteCultivoController.eliminar);

module.exports = router;
