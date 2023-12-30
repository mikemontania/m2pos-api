const express = require('express');
const router = express.Router();
const varianteController = require('../controllers/variante-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

// Rutas para Variante con validación de JWT
router.get('/variantes/:id', validarJWT, varianteController.getById);
router.get('/variantes', validarJWT, varianteController.findAll);
router.post('/variantes', validarJWT, varianteController.create);
router.put('/variantes/:id', validarJWT, varianteController.update);
router.patch('/variantes/:id/disable', validarJWT, varianteController.disable);

module.exports = router;
