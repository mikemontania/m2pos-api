const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

// Rutas para Venta


router.get('/:id', validarJWT, ventaController.getById);
router.get('/:page/:pageSize/:fechaDesde/:fechaHasta/:clienteId/:sucursalId/:formaVentaId/:listaPrecioId/:nroComprobante?', validarJWT, ventaController.listarVentas);
router.post('/', validarJWT, ventaController.createVenta); 

router.put('/anular/:id', validarJWT, ventaController.anularVenta);

module.exports = router;
