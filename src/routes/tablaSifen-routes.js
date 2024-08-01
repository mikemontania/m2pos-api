const { Router } = require('express');
const tablaSifenController = require('../controllers/tablaSifen-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();

// Ruta para buscar un tablaSifen por ID
router.get('/:id', validarJWT,   tablaSifenController.getById);
// Ruta para buscar todos los tablaSifens
router.get('/tabla/:tabla', validarJWT,   tablaSifenController.findAllRecords);
// Ruta para buscar todos los tablaSifens
router.get('/', validarJWT,   tablaSifenController.findAll);

// Ruta para crear un tablaSifen
router.post('/', validarJWT,  auditMiddleware, tablaSifenController.create);

// Ruta para actualizar un tablaSifen
router.put('/:id', validarJWT,  auditMiddleware, tablaSifenController.update);

// Ruta para desactivar un tablaSifen
router.put('/desactivar/:id', validarJWT,  auditMiddleware, tablaSifenController.disable);

module.exports = router;
