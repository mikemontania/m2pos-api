const { Router } = require('express');
const variedadController = require('../controllers/variedad-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();

// Ruta para buscar una presentación por ID
router.get('/:id', validarJWT,   variedadController.getById);

// Ruta para buscar todas las variedades
router.get('/', validarJWT,    variedadController.findAll);

// Ruta para crear una nueva presentación
router.post('/', validarJWT,   variedadController.create);

// Ruta para actualizar una presentación por ID
router.put('/:id', validarJWT,   variedadController.update);

// Ruta para desactivar una presentación (marcar como inactiva)
router.delete('/:id', validarJWT,   variedadController.disable);

module.exports = router;
