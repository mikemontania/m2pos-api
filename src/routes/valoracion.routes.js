const { Router } = require('express');
const valoracionController = require('../controllers/valoracion-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
 
router.get('/vigente/:id/:sucursalId/:listaPrecioId', validarJWT, valoracionController.obtenerValoracionVigente);
router.get('/findall/:fechaDesde/:registro/:tipo/:sucursalId/:listaPrecioId', validarJWT, valoracionController.obtenerValoraciones);
router.post('/', validarJWT, valoracionController.create);
router.put('/', validarJWT, valoracionController.update);
// Ruta para desactivar un precio (marcar como inactivo)
router.delete('/precio/:id', validarJWT, valoracionController.disable);

module.exports = router; 