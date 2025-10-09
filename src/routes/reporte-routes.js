const { Router } = require('express');
const report = require('../controllers/report-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt'); 
const router = Router();
 
// Ruta para buscar todas las categorías
router.get('/:id', validarJWT,   report.getPdf);
router.get('/ticket/:id/:doc', validarJWT,   report.getTicket);
router.get('/reportecobranza/:fechaDesde/:fechaHasta/:sucursalId/:medioPagoId', validarJWT,   report.getReporteCobranza);
router.get('/documentosPorSucursal/:fechaDesde/:fechaHasta/:sucursalId', validarJWT,   report.getReporteDocumentosPorSucursal);
router.get('/topVariantes/:fechaDesde/:fechaHasta/:sucursalId', validarJWT,   report.getTopVariantes);
router.get('/topClientes/:fechaDesde/:fechaHasta/:sucursalId', validarJWT,   report.getTopClientes);
router.get('/topMediosDePago/:fechaDesde/:fechaHasta/:sucursalId', validarJWT,   report.getInformeMediosDePago); 
router.get('/vendedoresPorTotal/:fechaDesde/:fechaHasta/:sucursalId', validarJWT,   report.getVendedoresPorTotal);
router.get('/topMediosDePagoNc/:fechaDesde/:fechaHasta/:sucursalId', validarJWT,   report.getInformeNC); 
// **Nuevas rutas para informes de documentos y pedidos**
router.get('/informe/documentos/:fechaDesde/:fechaHasta/:sucursalId', validarJWT, report.getInformeDocumentos);
router.get('/informe/pedidos/:fechaDesde/:fechaHasta/:sucursalId', validarJWT, report.getInformePedidos);

module.exports = router;
