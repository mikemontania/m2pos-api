const express = require('express');
const router = express.Router();
const expressFileUpload = require('express-fileupload');
const controller = require('../controllers/uploads-controller.js');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
const { validarJWT } = require('../middlewares/validar-jwt');
 
// Permite cargar el archivo
router.use(expressFileUpload());

// Ruta para cargar una imagen
router.put('/:tipo/:id', validarJWT,  auditMiddleware, controller.fileUpload);
// Ruta para obtener una imagen
router.get('/:tipo/:foto', controller.getImage);

module.exports = router;
