const { Router } = require('express');
const valoracionController = require('../controllers/valoracion-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();
router.get('/descuentoescala/:listaPrecioId/:sucursalId', validarJWT,   valoracionController.obtenerDescuentoImporte);
router.get('/vigente/:id/:sucursalId/:listaPrecioId', validarJWT,    valoracionController.obtenerValoracionVigente);
router.get('/findall/:fechaDesde/:registro/:tipo/:sucursalId/:listaPrecioId', validarJWT,    valoracionController.obtenerValoraciones);
router.post('/', validarJWT,  auditMiddleware,  valoracionController.create);
router.put('/:id', validarJWT,  auditMiddleware,  valoracionController.update);
// Ruta para desactivar un precio (marcar como inactivo)
router.put('/precio/:id', validarJWT,  auditMiddleware,  valoracionController.disable);
router.delete('/:id', validarJWT,  auditMiddleware,  valoracionController.deletebyId); 

module.exports = router; 