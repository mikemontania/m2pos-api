const { Router } = require('express');
const creditoController = require('../controllers/credito-controller.js');
const historialCreditoController = require('../controllers/historialCredito-controller.js');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
router.get("/historial/:creditoId", validarJWT,  historialCreditoController.getHistorial);
// Ruta para obtener el widget con los totales
router.get("/widget/:fechaInicio/:fechaFin", validarJWT,  creditoController.obtenerWidget);
// Ruta para obtener los créditos de forma paginada
router.get("/buscar/paginado/:page/:size/:fechaInicio/:fechaFin/:clienteId/:nroComprobante/:estado", validarJWT,  creditoController.buscarPaginado);
// Ruta para obtener la lista completa de créditos
router.get("/buscar/lista/fechaInicio/:fechaFin/:clienteId/:nroComprobante/:estado/:diasMora", validarJWT,  creditoController.buscarLista);
// Ruta para obtener la lista completa de créditos

router.post("/pagar/:creditoId", validarJWT,  creditoController.pagarCredito);

module.exports = router;
