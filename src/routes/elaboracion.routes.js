// ============================================
// RUTAS: /api/elaboracion (OPTIMIZADAS)
// ============================================

const express = require('express');
const router = express.Router();
const { validarJWT } = require('../middlewares/validar-jwt');

const {
  registrarElaboracion,
  actualizarElaboracion,      
  finalizarElaboracion,        
  listarElaboraciones,
  obtenerDetalleElaboracion,
  eliminarElaboracion,         
  listarTanques,
  listarCultivos,generarReportePDF,
  listarVariantesProduccion,
  reporteDiario,
  reportePendientes             
} = require('../controllers/RegistroElaboracion.controller');

// ============================================
// RUTAS CRUD PRINCIPALES
// ============================================

/**
 * POST /api/elaboracion/registrar
 * Registra nueva elaboración
 * Body: {
 *   fechaElaboracion: "2025-11-02",
 *   tanqueFermentadorId: 1,
 *   cultivoId: 2,                          // ⭐ CAMBIO
 *   numeroLoteCultivo: "4434821414",       // ⭐ NUEVO
 *   fechaVencimientoCultivo: "2026-01-15", // ⭐ NUEVO (opcional)
 *   cantidadLitros: 22,
 *   horaCultivo: "08:30",
 *   temperaturaCultivo: 42.5,
 *   phMaduracion: 4.7,
 *   horaFiltrado: "13:15",
 *   codigoEnvasado: "01",
 *   realizadoPor: "PG",
 *   observaciones: "",
 *   variantes: [
 *     { 
 *       varianteId: 1, 
 *       cantidad: 50, 
 *       numeroLoteEsencia: "ABC123",         // ⭐ NUEVO (si usaEsencia=true)
 *       fechaVencimientoEsencia: "2026-03-15", // ⭐ NUEVO (si usaEsencia=true)
 *       diasVida: 30 
 *     }
 *   ]
 * }
 */
router.post('/registrar', validarJWT, registrarElaboracion);

/**
 * PUT /api/elaboracion/:id
 * Actualiza una elaboración existente (solo si NO está finalizada)
 * ⭐ NUEVO
 */
router.put('/:id', validarJWT, actualizarElaboracion);

/**
 * PUT /api/elaboracion/:id/finalizar
 * Finaliza una elaboración (ya no se podrá editar)
 * ⭐ NUEVO
 */
router.put('/:id/finalizar', validarJWT, finalizarElaboracion);

/**
 * DELETE /api/elaboracion/:id
 * Elimina una elaboración (solo si NO está finalizada)
 * ⭐ NUEVO
 */
router.delete('/:id', validarJWT, eliminarElaboracion);

/**
 * GET /api/elaboracion/listar
 * Lista registros de elaboración
 * Query params: 
 *   ?fechaDesde=2025-10-01
 *   &fechaHasta=2025-10-31
 *   &numeroLote=L30102501A
 *   &soloNoFinalizados=true  // ⭐ NUEVO
 */
router.get('/listar', validarJWT, listarElaboraciones);
// ⭐ NUEVA RUTA PARA PDF
router.get('/reporte/pdf', validarJWT, generarReportePDF);
/**
 * GET /api/elaboracion/:id
 * Obtiene detalle completo de un registro
 */
router.get('/:id', validarJWT, obtenerDetalleElaboracion);

// ============================================
// RUTAS DE MAESTROS (Simplificadas)
// ============================================

/**
 * GET /api/elaboracion/maestros/tanques
 * Lista tanques fermentadores activos
 */
router.get('/maestros/tanques', validarJWT, listarTanques);

/**
 * GET /api/elaboracion/maestros/cultivos
 * Lista cultivos activos (SIN lotes)
 * ⭐ SIMPLIFICADO - Ya no devuelve lotes anidados
 */
router.get('/maestros/cultivos', validarJWT, listarCultivos);

/**
 * GET /api/elaboracion/maestros/variantes
 * Lista variantes disponibles para producción
 * ⭐ MODIFICADO - Incluye campo usaEsencia
 */
router.get('/maestros/variantes', validarJWT, listarVariantesProduccion);

// ❌ ELIMINADAS estas rutas:
// router.get('/maestros/lotes-cultivo/:cultivoId', ...)
// router.get('/maestros/esencias', ...)
// router.get('/maestros/lotes-esencia/:esenciaId', ...)

// ============================================
// RUTAS DE REPORTES
// ============================================

/**
 * GET /api/elaboracion/reporte/diario
 * Reporte de producción diaria
 * Query params: ?fecha=2025-11-02
 */
router.get('/reporte/diario', validarJWT, reporteDiario);

/**
 * GET /api/elaboracion/reporte/pendientes
 * Lista elaboraciones no finalizadas
 * ⭐ NUEVO
 */
router.get('/reporte/pendientes', validarJWT, reportePendientes);

module.exports = router;