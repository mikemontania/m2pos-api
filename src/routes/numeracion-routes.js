const { Router } = require('express');
const numeracionController = require('../controllers/numeracion-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();

// Ruta para buscar una numeración por ID
router.get('/:id', validarJWT,   numeracionController.getById);


router.get('/paginados/:page/:pageSize?', validarJWT,  numeracionController.findNumeracionesPaginados);

// Ruta para buscar todas las numeraciones
router.get('/list/:sucursalId', validarJWT,   numeracionController.findAll);

// Ruta para crear una nueva numeración
router.post('/', validarJWT,  auditMiddleware, numeracionController.create);

// Ruta para actualizar una numeración por ID
router.put('/:id', validarJWT,  auditMiddleware, numeracionController.update);

// Ruta para desactivar una numeración por ID
router.put('/desactivar/:id', validarJWT,  auditMiddleware, numeracionController.disable);

module.exports = router;
