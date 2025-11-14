const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/ecommerce-pedido-controller.js');
 const { validarJWT } = require('../middlewares/validar-jwt'); 

router.post('/', validarJWT, pedidoController.crearPedido);

module.exports = router;