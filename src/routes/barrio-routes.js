const { Router } = require('express');
const barrioController = require('../controllers/barrio-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();

// Ruta para buscar un barrio por ID
router.get('/id/:id', validarJWT,   barrioController.getById);
router.get('/ciud/:codCiudad', validarJWT,   barrioController.getBycodCiudad);
// Ruta para buscar todos los barrios
router.get('/', validarJWT,   barrioController.findAll);

// Ruta para crear un barrio
router.post('/', validarJWT,   barrioController.create);

// Ruta para actualizar un barrio
router.put('/:id', validarJWT,   barrioController.update);
 

module.exports = router;
