const { Router } = require('express');
const presentacionController = require('../controllers/presentacion-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar una presentación por ID
router.get('/presentacion/:id', validarJWT, presentacionController.getById);

// Ruta para buscar todas las presentaciones
router.get('/presentaciones', validarJWT, presentacionController.findAll);

// Ruta para crear una nueva presentación
router.post('/presentacion', validarJWT, presentacionController.create);

// Ruta para actualizar una presentación por ID
router.put('/presentacion/:id', validarJWT, presentacionController.update);

// Ruta para desactivar una presentación (marcar como inactiva)
router.delete('/presentacion/:id', validarJWT, presentacionController.disable);

module.exports = router;
