const { Router } = require('express');
const empresaController = require('../controllers/empresa-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar una categoría por ID
router.get('/actividades', validarJWT,    empresaController.obtenerActividadesPorEmpresa); 
router.get('/empresa', validarJWT,    empresaController.getData);  

router.post('/add-actividades', validarJWT,   empresaController.agregarActividadAEmpresa);
router.delete('/remove-actividad/:actividadId',  validarJWT,  empresaController.eliminarActividadDeEmpresa);
router.get('/:id', validarJWT,    empresaController.getById); 
router.put('/:id', validarJWT,   empresaController.update);

module.exports = router;
