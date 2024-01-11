const { Router } = require('express');
const report = require('../controllers/report-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
 
// Ruta para buscar todas las categorías
router.get('/', validarJWT, report.getPdf);
 

module.exports = router;
