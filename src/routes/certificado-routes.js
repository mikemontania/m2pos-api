const { Router } = require('express');
const certificadoController = require('../controllers/certificado-controller'); // Ajusta la ruta del controlador según sea necesario
const { validarJWT } = require('../middlewares/validar-jwt');
const { auditMiddleware } = require('../middlewares/auditMiddleware');

const router = Router();

// Ruta para buscar un certificado por ID
router.get('/:id', validarJWT, certificadoController.getById);

// Ruta para buscar todos los certificados
router.get('/', validarJWT, certificadoController.findAll);

// Ruta para crear un certificado
router.post('/', validarJWT, auditMiddleware, certificadoController.create);

// Ruta para actualizar un certificado por ID
router.put('/:id', validarJWT, auditMiddleware, certificadoController.update);

// Ruta para desactivar un certificado (si es necesario, puedes añadir este método en el controlador)
router.put('/desactivar/:id', validarJWT, auditMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const certificado = await Certificado.findByPk(id);
    
    if (certificado) {
      await certificado.update({ activo: false });
      res.status(200).json({ message: 'Certificado desactivado correctamente' });
    } else {
      res.status(404).json({ error: 'Certificado no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.original?.detail || 'Error al desactivar el Certificado' });
  }
});

module.exports = router;
