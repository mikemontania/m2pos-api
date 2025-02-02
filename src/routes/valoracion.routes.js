const { Router } = require('express');
const valoracionController = require('../controllers/valoracion-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();
router.get('/descuentoescala/:listaPrecioId/:sucursalId', validarJWT,   valoracionController.obtenerDescuentoImporte);
router.get('/vigente/:id/:sucursalId/:listaPrecioId', validarJWT,    valoracionController.obtenerValoracionVigente);
router.get('/findall/:fechaDesde/:registro/:tipo/:sucursalId/:listaPrecioId', validarJWT,    valoracionController.obtenerValoraciones);
router.post('/', validarJWT,    valoracionController.create);
router.put('/:id', validarJWT,    valoracionController.update);
// Ruta para desactivar un precio (marcar como inactivo)
router.put('/precio/:id', validarJWT,    valoracionController.disable);
router.delete('/:id', validarJWT,    valoracionController.deletebyId); 

module.exports = router; 