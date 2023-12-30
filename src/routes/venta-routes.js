const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

// Rutas para Venta
router.post('/ventas', validarJWT, ventaController.createVenta);
router.patch('/ventas/:id/anular', validarJWT, ventaController.anularVenta);
router.get('/ventas', validarJWT, ventaController.listarVentas);

module.exports = router;
