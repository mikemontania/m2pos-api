const { Router } = require('express');
const marcaController = require('../controllers/marca-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar una marca por ID
router.get('/marca/:id', validarJWT, marcaController.getById);

// Ruta para buscar todas las marcas
router.get('/marcas', validarJWT, marcaController.findAll);

// Ruta para crear una nueva marca
router.post('/marca', validarJWT, marcaController.create);

// Ruta para actualizar una marca por ID
router.put('/marca/:id', validarJWT, marcaController.update);

// Ruta para desactivar una marca por ID
router.put('/marcadesactivar/:id', validarJWT, marcaController.disable);

module.exports = router;
