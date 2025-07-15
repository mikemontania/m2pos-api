const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt'); 
 
 
 
router.get('/:id', validarJWT,   pedidoController.getById);
router.get('/:page/:pageSize/:fechaDesde/:fechaHasta/:clienteSucursalId/:sucursalId/:condicionPagoId/:listaPrecioId/:canal', validarJWT,   pedidoController.listar);
router.get('/:fechaDesde/:fechaHasta/:clienteSucursalId/:sucursalId/:condicionPagoId/:listaPrecioId/:canal', validarJWT,   pedidoController.listarSinPaginacion);

router.post('/nuevo', validarJWT,   pedidoController.create );   
router.put('/anular/:id', validarJWT,   pedidoController.anular );
router.put('/update/:id/:campo/:valor',validarJWT,pedidoController.updateCampos);
module.exports = router;
