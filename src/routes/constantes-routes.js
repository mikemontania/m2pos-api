// routes/constantes.routes.js
const express = require('express');

const { Router } = require('express');
const constController =  require('../controllers/constantes-controller');

 
const router = Router();


// Ruta para obtener todos los elementos de un tipo específico
router.get('/all/:type', constController.findAll);

// Ruta para obtener elementos de un tipo específico filtrados por un grupo ID
router.get('/filter/:type/:grupoId', constController.getByTypeAndGroupId);

module.exports = router;
