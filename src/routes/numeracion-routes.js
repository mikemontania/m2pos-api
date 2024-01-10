const { Router } = require('express');
const numeracionController = require('../controllers/numeracion-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar una numeración por ID
router.get('/:id', validarJWT, numeracionController.getById);

// Ruta para buscar todas las numeraciones
router.get('/list/:sucursal?', validarJWT, numeracionController.findAll);

// Ruta para crear una nueva numeración
router.post('/', validarJWT, numeracionController.create);

// Ruta para actualizar una numeración por ID
router.put('/:id', validarJWT, numeracionController.update);

// Ruta para desactivar una numeración por ID
router.put('/desactivar/:id', validarJWT, numeracionController.disable);

module.exports = router;
