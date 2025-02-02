const { Router } = require('express');
const presentacionController = require('../controllers/presentacion-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();

// Ruta para buscar una presentación por ID
router.get('/:id', validarJWT,    presentacionController.getById);

// Ruta para buscar todas las presentaciones
router.get('/', validarJWT,   presentacionController.findAll);

// Ruta para crear una nueva presentación
router.post('/', validarJWT,   presentacionController.create);

// Ruta para actualizar una presentación por ID
router.put('/:id', validarJWT,   presentacionController.update);

// Ruta para desactivar una presentación (marcar como inactiva)
router.delete('/:id', validarJWT,   presentacionController.disable);

module.exports = router;
