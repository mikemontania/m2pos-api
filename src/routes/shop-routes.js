const express = require('express');
const router = express.Router();
const productoController = require('../controllers/shop-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

router.get('/productos', validarJWT, productoController.listarProductos);

module.exports = router;
