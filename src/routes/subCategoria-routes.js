const express = require('express');
const router = express.Router();
const subCategoriaController = require('../controllers/subCategoria-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

// Rutas para SubCategoría con validación de JWT
router.get('/:id', validarJWT, subCategoriaController.getById);
router.get('/', validarJWT, subCategoriaController.findAll);
router.post('/', validarJWT, subCategoriaController.create);
router.put('/:id', validarJWT, subCategoriaController.update);
router.patch('/subcategorias/:id/disable', validarJWT, subCategoriaController.disable);

module.exports = router;
