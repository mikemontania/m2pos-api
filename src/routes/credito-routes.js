const { Router } = require('express');
const creditoController = require('../controllers/credito-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const router = Router();
router.get('/paginado/:page/:pageSize/:fecha/:sucursalId/:formaVentaId/:clienteId/:pagado', validarJWT,  creditoController.findCredits);
 
router.post('/', validarJWT,  auditMiddleware, creditoController.create);
 
router.put('/:id', validarJWT,  auditMiddleware, creditoController.update);
 

module.exports = router;
