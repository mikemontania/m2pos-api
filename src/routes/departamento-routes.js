const { Router } = require('express');
const departamentoController = require('../controllers/departamento-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();

// Ruta para buscar un departamento por ID
router.get('/:id', validarJWT,   departamentoController.getById);

// Ruta para buscar todos los departamentos
router.get('/', validarJWT,   departamentoController.findAll);

// Ruta para crear un departamento
router.post('/', validarJWT,   departamentoController.create);

// Ruta para actualizar un departamento
router.put('/:id', validarJWT,   departamentoController.update);
 

module.exports = router;
