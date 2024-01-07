const { Router } = require('express');
const sucursalController = require('../controllers/sucursal-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
 
// Ruta para buscar un sucursal por ID
router.get('/:id', validarJWT, sucursalController.getById);

// Ruta para buscar todos los sucursales
router.get('/', validarJWT, sucursalController.findAll); 

// Ruta para desactivar un sucursal por ID
router.put('/desactivar/:id', validarJWT, sucursalController.disable);

module.exports = router;
