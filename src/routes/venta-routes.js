const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

// Rutas para Venta


router.get('/:id', validarJWT, ventaController.getById);
router.get('/', validarJWT, ventaController.listarVentas);
router.post('/', validarJWT, ventaController.createVenta); 

router.patch('/:id/anular', validarJWT, ventaController.anularVenta);

module.exports = router;
