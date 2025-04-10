const { Router } = require('express');
const documentoXmlController = require('../controllers/documentoXml-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

// Ruta para buscar XMLs por documentoId
router.get('/historialxml/:documentoId', validarJWT, documentoXmlController.findByDocumentoId);
// Ruta para buscar un XML por ID
router.get('/id/:id', validarJWT, documentoXmlController.getById);

// Ruta para crear un nuevo XML
router.post('/', validarJWT,  documentoXmlController.create);

// Ruta para actualizar un XML por ID
router.put('/:id', validarJWT,  documentoXmlController.update);



module.exports = router;