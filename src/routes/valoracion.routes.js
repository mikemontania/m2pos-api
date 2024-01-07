const { Router } = require('express');
const valoracionController = require('../controllers/valoracion-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
 
router.get('/vigente/:id/:listaPrecioId/:tabla/:tipo', validarJWT, valoracionController.obtenerValoracionVigente);
 

// Ruta para desactivar un precio (marcar como inactivo)
router.delete('/precio/:id', validarJWT, valoracionController.disable);

module.exports = router;
