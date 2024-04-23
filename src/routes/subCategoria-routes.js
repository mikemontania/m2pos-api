const express = require('express');
const router = express.Router();
const subCategoriaController = require('../controllers/subCategoria-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');
// Rutas para SubCategoría con validación de JWT
router.get('/:id', validarJWT,   subCategoriaController.getById);
router.get('/', validarJWT,  subCategoriaController.findAll);
router.post('/', validarJWT,  auditMiddleware, subCategoriaController.create);
router.put('/:id', validarJWT,  auditMiddleware, subCategoriaController.update);
router.patch('/subcategorias/:id/disable', validarJWT,  auditMiddleware, subCategoriaController.disable);

module.exports = router;
