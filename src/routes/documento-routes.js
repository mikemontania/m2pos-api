const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documento-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt'); 
// Rutas para Documento
 
 
router.get('/:id', validarJWT,   documentoController.getById);
router.get('/:page/:pageSize/:fechaDesde/:fechaHasta/:clienteSucursalId/:sucursalId/:condicionPagoId/:listaPrecioId/:nroComprobante?', validarJWT,   documentoController.listarDocumentos);
router.post('/factura', validarJWT,   documentoController.createDocumento); 
router.post('/notacredito', validarJWT,   documentoController.crearNotaCredito); 

router.put('/anular/:id', validarJWT,   documentoController.anularDocumento);

module.exports = router;
