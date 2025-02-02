const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
// Rutas para Venta

router.get('/generar-xml/:id', validarJWT,   ventaController.generateXML);
router.get('/firmar-xml/:id', validarJWT,   ventaController.firmarXML);
router.get('/:id', validarJWT,   ventaController.getById);
router.get('/:page/:pageSize/:fechaDesde/:fechaHasta/:clienteId/:sucursalId/:formaVentaId/:listaPrecioId/:nroComprobante?', validarJWT,   ventaController.listarVentas);
router.post('/', validarJWT,   ventaController.createVenta); 

router.put('/anular/:id', validarJWT,   ventaController.anularVenta);

module.exports = router;
