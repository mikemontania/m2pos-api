// ============================================
// RUTAS: /api/elaboracion
// ============================================

const express = require('express');
const router = express.Router();
const { validarJWT } = require('../middlewares/validar-jwt');

const {
  registrarElaboracion,
  listarElaboraciones,
  obtenerDetalleElaboracion,
  listarTanques,
  listarCultivos,
  listarLotesCultivo,
  listarEsencias,
  listarLotesEsencia,
  listarVariantesProduccion, 
  reporteDiario
} = require('../controllers/RegistroElaboracion.controller');
 

// ============================================
// RUTAS PRINCIPALES
// ============================================

/**
 * POST /api/elaboracion/registrar
 * Registra nueva elaboración desde tablet
 * Body: {
 *   fechaElaboracion: "2025-11-02",
 *   tanqueFermentadorId: 1,
 *   loteCultivoId: 2,
 *   cantidadLitros: 22,
 *   horaCultivo: "08:30",
 *   temperaturaCultivo: 42.5,
 *   phMaduracion: 4.7,
 *   horaFiltrado: "13:15",
 *   codigoEnvasado: "01",
 *   realizadoPor: "PG",
 *   observaciones: "",
 *   variantes: [
 *     { varianteId: 1, cantidad: 50, loteEsenciaId: 1, diasVida: 30 }
 *   ]
 * }
 */
router.post('/registrar', validarJWT, registrarElaboracion);

/**
 * GET /api/elaboracion/listar
 * Lista registros de elaboración
 * Query params: ?fechaDesde=2025-10-01&fechaHasta=2025-10-31&numeroLote=L30102501A
 */
router.get('/listar',validarJWT,  listarElaboraciones);

/**
 * GET /api/elaboracion/:id
 * Obtiene detalle completo de un registro
 */
router.get('/:id', validarJWT, obtenerDetalleElaboracion);

// ============================================
// RUTAS DE MAESTROS (para formularios)
// ============================================

/**
 * GET /api/elaboracion/maestros/tanques
 * Lista tanques fermentadores activos
 */
router.get('/maestros/tanques',validarJWT,  listarTanques);

/**
 * GET /api/elaboracion/maestros/cultivos
 * Lista cultivos activos
 */
router.get('/maestros/cultivos',validarJWT,  listarCultivos);

/**
 * GET /api/elaboracion/maestros/lotes-cultivo/:cultivoId
 * Lista lotes de un cultivo específico
 */
router.get('/maestros/lotes-cultivo/:cultivoId',validarJWT,  listarLotesCultivo);

/**
 * GET /api/elaboracion/maestros/esencias
 * Lista esencias activas
 */
router.get('/maestros/esencias', validarJWT, listarEsencias);

/**
 * GET /api/elaboracion/maestros/lotes-esencia/:esenciaId
 * Lista lotes de una esencia específica
 */
router.get('/maestros/lotes-esencia/:esenciaId',validarJWT,  listarLotesEsencia);

/**
 * GET /api/elaboracion/maestros/variantes
 * Lista variantes disponibles para producción
 */
router.get('/maestros/variantes', validarJWT, listarVariantesProduccion);
 
// ============================================
// RUTAS DE REPORTES
// ============================================

/**
 * GET /api/elaboracion/reporte/diario
 * Reporte de producción diaria
 * Query params: ?fecha=2025-11-02
 */
router.get('/reporte/diario',validarJWT,  reporteDiario);

module.exports = router;