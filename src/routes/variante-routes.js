const express = require('express');
const router = express.Router();
const varianteController = require('../controllers/variante-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
// Rutas para Variante con validación de JWT 
router.get('/descripcion', validarJWT,  varianteController.findDescripcion); 
router.get('/findAllDesc/:page/:pageSize/:descripcion?', validarJWT,  varianteController.findAllDesc); 
router.get('/:id', validarJWT,   varianteController.getById);
router.get('/producto/:productoId', validarJWT,   varianteController.findAllByProducto);
router.get('/', validarJWT,  varianteController.findAll);
router.post('/', validarJWT,  auditMiddleware, varianteController.create);
router.put('/:id', validarJWT,  auditMiddleware, varianteController.update);
router.patch('/:id/disable', validarJWT,  auditMiddleware, varianteController.disable);

module.exports = router;
