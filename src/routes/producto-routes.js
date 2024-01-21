const { Router } = require('express');
const productoController = require('../controllers/producto-controller.js');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Ruta para buscar un producto por ID
router.get('/:id', validarJWT, productoController.getById);
router.get('/paginados/simple/:page/:pageSize/:descripcion?', validarJWT,productoController.findSearchPaginadosSimple);

router.get('/paginados/:sucursalId/:listaPrecioId/:page/:pageSize/:marcaId/:categoriaId/:subCategoriaId/:descripcion?', validarJWT,productoController.findProductosPaginados);

// Ruta para buscar todos los productos
router.get('/', validarJWT, productoController.findAll);

// Ruta para crear un nuevo producto
router.post('/', validarJWT, productoController.create);

// Ruta para actualizar un producto por ID
router.put('/:id', validarJWT, productoController.update);

// Ruta para desactivar un producto (marcar como inactivo)
router.delete('/:id', validarJWT, productoController.disable);

module.exports = router;
