const { Router } = require('express');
const ciudadController = require('../controllers/ciudad-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar un ciudad por ID
router.get('/id/:id', validarJWT,   ciudadController.getById); 
router.get('/dep/:codDepartamento', validarJWT,   ciudadController.getBycodDepartamento); 

// Ruta para buscar todos los ciudads
router.get('/', validarJWT,   ciudadController.findAll);

// Ruta para crear un ciudad
router.post('/', validarJWT,   ciudadController.create);

// Ruta para actualizar un ciudad
router.put('/:id', validarJWT,   ciudadController.update);
 

module.exports = router;
