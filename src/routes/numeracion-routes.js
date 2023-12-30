const { Router } = require('express');
const numeracionController = require('../controllers/numeracion-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar una numeración por ID
router.get('/numeracion/:id', validarJWT, numeracionController.getById);

// Ruta para buscar todas las numeraciones
router.get('/numeraciones', validarJWT, numeracionController.findAll);

// Ruta para crear una nueva numeración
router.post('/numeracion', validarJWT, numeracionController.create);

// Ruta para actualizar una numeración por ID
router.put('/numeracion/:id', validarJWT, numeracionController.update);

// Ruta para desactivar una numeración por ID
router.put('/numeraciondesactivar/:id', validarJWT, numeracionController.disable);

module.exports = router;
