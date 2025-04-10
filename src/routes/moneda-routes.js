const { Router } = require('express');
const monedaController = require('../controllers/moneda-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar un moneda por ID
router.get('/:codigo', validarJWT,   monedaController.getById);

// Ruta para buscar todos los monedas
router.get('/', validarJWT,   monedaController.findAll);
 

module.exports = router;
