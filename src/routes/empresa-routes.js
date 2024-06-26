const { Router } = require('express');
const empresaController = require('../controllers/empresa-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();

// Ruta para buscar una categoría por ID
router.get('/:id', validarJWT,    empresaController.getById); 
// Ruta para actualizar una categoría por ID
router.put('/:id', validarJWT,  auditMiddleware, empresaController.update);
 

module.exports = router;
