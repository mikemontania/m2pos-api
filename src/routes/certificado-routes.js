const { Router } = require('express');
const certificadoController = require('../controllers/certificado-controller'); // Ajusta la ruta del controlador según sea necesario
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

// Ruta para buscar un certificado por ID
router.get('/get', validarJWT, certificadoController.getCertificado);
  

// Ruta para actualizar un certificado por ID
router.put('/update/:id', validarJWT,  certificadoController.update);
 
module.exports = router;
