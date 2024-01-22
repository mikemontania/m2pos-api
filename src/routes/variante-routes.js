const express = require('express');
const router = express.Router();
const varianteController = require('../controllers/variante-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

// Rutas para Variante con validación de JWT
router.get('/:id', validarJWT, varianteController.getById);
router.get('/producto/:productoId', validarJWT, varianteController.findAllByProducto);
router.get('/', validarJWT, varianteController.findAll);
router.post('/', validarJWT, varianteController.create);
router.put('/:id', validarJWT, varianteController.update);
router.patch('/:id/disable', validarJWT, varianteController.disable);

module.exports = router;
