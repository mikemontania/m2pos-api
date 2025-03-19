const { Router } = require('express');
const creditoController = require('../controllers/credito-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
router.get('/paginado/:page/:pageSize/:fecha/:sucursalId/:condicionPagoId/:clienteId/:pagado', validarJWT,  creditoController.findCredits);
 
router.post('/', validarJWT,   creditoController.create);
 
router.put('/:id', validarJWT,   creditoController.update);
 

module.exports = router;
