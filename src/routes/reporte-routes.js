const { Router } = require('express');
const report = require('../controllers/report-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt'); 
const router = Router();
 
// Ruta para buscar todas las categorías
router.get('/:id', validarJWT,   report.getPdf);
router.get('/reportecobranza/:fechaDesde/:fechaHasta/:sucursalId/:medioPagoId', validarJWT,   report.getReporteCobranza);
router.get('/ventasPorSucursal/:fechaDesde/:fechaHasta/:sucursalId', validarJWT,   report.getReporteVentasPorSucursal);
router.get('/topVariantes/:fechaDesde/:fechaHasta/:sucursalId', validarJWT,   report.getTopVariantes);
router.get('/topClientes/:fechaDesde/:fechaHasta/:sucursalId', validarJWT,   report.getTopClientes);
router.get('/topMediosDePago/:fechaDesde/:fechaHasta/:sucursalId', validarJWT,   report.getInformeMediosDePago); 
router.get('/vendedoresPorTotal/:fechaDesde/:fechaHasta/:sucursalId', validarJWT,   report.getVendedoresPorTotal);
 
module.exports = router;
