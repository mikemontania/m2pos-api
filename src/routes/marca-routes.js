const { Router } = require('express');
const marcaController = require('../controllers/marca-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();

// Ruta para buscar una marca por ID
router.get('/:id', validarJWT,   marcaController.getById);

// Ruta para buscar todas las marcas
router.get('/', validarJWT,   marcaController.findAll);

// Ruta para crear una nueva marca
router.post('/', validarJWT,   marcaController.create);

// Ruta para actualizar una marca por ID
router.put('/:id', validarJWT,   marcaController.update);

// Ruta para desactivar una marca por ID
router.put('/marcadesactivar/:id', validarJWT,   marcaController.disable);

module.exports = router;
