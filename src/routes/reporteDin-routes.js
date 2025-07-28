const { Router } = require('express');
const reporteController = require('../controllers/reporte-controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Obtener un reporte por ID
router.get('/id/:id', validarJWT, reporteController.getById);

// Listar todos los reportes de la empresa del token
router.get('/search/:search?', validarJWT, reporteController.search);

// Crear un nuevo reporte
router.post('/', validarJWT, reporteController.create);
// Crear un nuevo reporte
router.put('/:id', validarJWT, reporteController.update);
// Ejecutar un reporte (empresaId viene del token)
router.post('/ejecutar/:id', validarJWT, reporteController.ejecutarReporte);

module.exports = router;
