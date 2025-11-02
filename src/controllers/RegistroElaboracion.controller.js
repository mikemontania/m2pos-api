// ============================================
// CONTROLADOR: Registro de Elaboración
// ============================================

const {
  guardarRegistroElaboracion,
  obtenerRegistrosElaboracion
} = require('../helpers/lote-produccion.helper');
const Cultivo = require('../models/cultivo.model');
const DetalleElaboracionVariante = require('../models/detalleElaboracion.model');
const Esencia = require('../models/esencia.models');
const LoteCultivo = require('../models/loteCultivo.model');
const LoteEsencia = require('../models/loteEsencia.model');
const Presentacion = require('../models/presentacion.model');
const Producto = require('../models/producto.model');
const RegistroElaboracion = require('../models/RegistroElaboracion.model');
const TanqueFermentador = require('../models/tanqueFermentador.model');
const Variante = require('../models/variante.model'); 
/**
 * POST /api/elaboracion/registrar
 * Registra una nueva elaboración desde la tablet
 */
const registrarElaboracion = async (req, res) => {
  try {
    const { empresaId, usuarioId } = req.usuario;
    const datosFormulario = req.body;

    const resultado = await guardarRegistroElaboracion(
      datosFormulario,
      empresaId,
      usuarioId
    );

    if (resultado.success) {
      return res.status(201).json({
        success: true,
        message: 'Registro de elaboración creado exitosamente',
        data: resultado.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: resultado.error
      });
    }
  } catch (error) {
    console.error('Error al registrar elaboración:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * GET /api/elaboracion/listar
 * Obtiene registros de elaboración con filtros
 * Query params: fechaDesde, fechaHasta, numeroLote
 */
const listarElaboraciones = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { fechaDesde, fechaHasta, numeroLote } = req.query;

    const filtros = {
      empresaId,
      fechaDesde: fechaDesde || null,
      fechaHasta: fechaHasta || null,
      numeroLote: numeroLote || null
    };

    const registros = await obtenerRegistrosElaboracion(filtros);

    return res.json({
      success: true,
      data: registros,
      total: registros.length
    });
  } catch (error) {
    console.error('Error al listar elaboraciones:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener registros',
      error: error.message
    });
  }
};

/**
 * GET /api/elaboracion/:id
 * Obtiene detalle de un registro específico
 */
const obtenerDetalleElaboracion = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { id } = req.params;

    const registro = await RegistroElaboracion.findOne({
      where: { id, empresaId },
      include: [
        {
          model: TanqueFermentador,
          as: 'tanque',
          attributes: ['id', 'codigo', 'letraLote', 'descripcion']
        },
        {
          model: LoteCultivo,
          as: 'loteCultivo',
          include: [
            {
              model: Cultivo,
              as: 'cultivo'
            }
          ]
        },
        {
          model: DetalleElaboracionVariante,
          as: 'detalles',
          include: [
            {
              model: Variante,
              as: 'variante',
             include: [
        {
          association: 'producto',
          attributes: ['id', 'nombre']
        },
        {
          association: 'presentacion',
          attributes: ['id', 'descripcion']
        },
        {
          association: 'variedad',
          attributes: ['id', 'descripcion']
        }
      ]
            },
            {
              model: LoteEsencia,
              as: 'loteEsencia',
              include: [
                {
                  model: Esencia,
                  as: 'esencia'
                }
              ]
            }
          ]
        }
      ]
    });

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro no encontrado'
      });
    }

    return res.json({
      success: true,
      data: registro
    });
  } catch (error) {
    console.error('Error al obtener detalle:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener detalle',
      error: error.message
    });
  }
};

/**
 * GET /api/elaboracion/maestros/tanques
 * Obtiene lista de tanques fermentadores activos
 */
const listarTanques = async (req, res) => {
  try {
    const { empresaId } = req.usuario;

    const tanques = await TanqueFermentador.findAll({
      where: { empresaId, activo: true },
      attributes: ['id', 'codigo', 'letraLote', 'descripcion', 'capacidadLitros'],
      order: [['codigo', 'ASC']]
    });

    return res.json({
      success: true,
      data: tanques
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener tanques',
      error: error.message
    });
  }
};

/**
 * GET /api/elaboracion/maestros/cultivos
 * Obtiene lista de cultivos activos
 */
const listarCultivos = async (req, res) => {
  try {
    const { empresaId } = req.usuario;

    const cultivos = await Cultivo.findAll({
      where: { empresaId, activo: true },
      order: [['codigo', 'ASC']]
    });

    return res.json({
      success: true,
      data: cultivos
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener cultivos',
      error: error.message
    });
  }
};

/**
 * GET /api/elaboracion/maestros/lotes-cultivo/:cultivoId
 * Obtiene lotes activos de un cultivo específico
 */
const listarLotesCultivo = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { cultivoId } = req.params;

    const lotes = await LoteCultivo.findAll({
      where: {
        empresaId,
        cultivoId,
        activo: true
      },
      include: [
        {
          model: Cultivo,
          as: 'cultivo'
        }
      ],
      order: [['fechaVencimiento', 'DESC']]
    });

    return res.json({
      success: true,
      data: lotes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener lotes de cultivo',
      error: error.message
    });
  }
};

/**
 * GET /api/elaboracion/maestros/esencias
 * Obtiene lista de esencias activas con sus lotes
 */
const listarEsencias = async (req, res) => {
  try {
    const { empresaId } = req.usuario;

    const esencias = await Esencia.findAll({
      where: { empresaId, activo: true },
      order: [['nombre', 'ASC']]
    });

    return res.json({
      success: true,
      data: esencias
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener esencias',
      error: error.message
    });
  }
};

/**
 * GET /api/elaboracion/maestros/lotes-esencia/:esenciaId
 * Obtiene lotes activos de una esencia específica
 */
const listarLotesEsencia = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { esenciaId } = req.params;

    const lotes = await LoteEsencia.findAll({
      where: {
        empresaId,
        esenciaId,
        activo: true
      },
      include: [
        {
          model: Esencia,
          as: 'esencia'
        }
      ],
      order: [['fechaVencimiento', 'DESC']]
    });

    return res.json({
      success: true,
      data: lotes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener lotes de esencia',
      error: error.message
    });
  }
};

/**
 * GET /api/elaboracion/maestros/variantes
 * Obtiene variantes disponibles para producción
 */
const listarVariantesProduccion = async (req, res) => {
  try {
    const { empresaId } = req.usuario;

    const variantes = await Variante.findAll({
      where: { empresaId, activo: true,elaborable:true },
      include: [
        {
          association: 'producto',
          attributes: ['id', 'nombre']
        },
        {
          association: 'presentacion',
          attributes: ['id', 'descripcion']
        },
        {
          association: 'variedad',
          attributes: ['id', 'descripcion']
        }
      ],
      order: [
        ['producto', 'nombre', 'ASC'],
        ['variedad', 'descripcion', 'ASC'],
        ['presentacion', 'descripcion', 'ASC']
      ]
    });

    return res.json({
      success: true,
      data: variantes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener variantes',
      error: error.message
    });
  }
};

/**
 * GET /api/elaboracion/reporte/diario
 * Reporte de producción diaria resumido
 */
const reporteDiario = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { fecha } = req.query;

    const fechaBuscar = fecha || new Date().toISOString().split('T')[0];

    const registros = await RegistroElaboracion.findAll({
      where: {
        empresaId,
        fechaElaboracion: fechaBuscar
      },
      include: [
        {
          model: TanqueFermentador,
          as: 'tanque',
          attributes: ['codigo', 'descripcion']
        },
        {
          model: LoteCultivo,
          as: 'loteCultivo',
          include: [
            {
              model: Cultivo,
              as: 'cultivo'
            }
          ]
        },
        {
          model: DetalleElaboracionVariante,
          as: 'detalles',
          include: [
            {
              model: Variante,
              as: 'variante',
              include: [ 
                {model: Producto,       as: 'producto',},
                 {model: Variedad,       as: 'variedad',},
                  {model: Presentacion,       as: 'presentacion',}
              ]
            }
          ]
        }
      ]
    });

    // Calcular totales
    let totalLitros = 0;
    let totalUnidades = 0;
    const produccionPorVariante = {};

    registros.forEach(reg => {
      totalLitros += parseFloat(reg.cantidadLitros);

      reg.detalles.forEach(det => {
        totalUnidades += det.cantidad;

        const key = `${det.variante.variedad.descripcion} ${det.variante.presentacion.descripcion}`;
        if (!produccionPorVariante[key]) {
          produccionPorVariante[key] = 0;
        }
        produccionPorVariante[key] += det.cantidad;
      });
    });

    return res.json({
      success: true,
      data: {
        fecha: fechaBuscar,
        totalRegistros: registros.length,
        totalLitros,
        totalUnidades,
        produccionPorVariante,
        registros
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al generar reporte',
      error: error.message
    });
  }
};

module.exports = {
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
};