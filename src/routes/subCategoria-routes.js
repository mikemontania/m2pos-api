const express = require('express');
const router = express.Router();
const subCategoriaController = require('../controllers/subCategoria-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

// Rutas para SubCategoría con validación de JWT
router.get('/subcategorias/:id', validarJWT, subCategoriaController.getById);
router.get('/subcategorias', validarJWT, subCategoriaController.findAll);
router.post('/subcategorias', validarJWT, subCategoriaController.create);
router.put('/subcategorias/:id', validarJWT, subCategoriaController.update);
router.patch('/subcategorias/:id/disable', validarJWT, subCategoriaController.disable);

module.exports = router;
