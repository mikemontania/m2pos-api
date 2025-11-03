// ============================================
// CONTROLADOR: Registro de Elaboración (OPTIMIZADO)
// ============================================

const {
  guardarRegistroElaboracion,
  actualizarRegistroElaboracion,
  finalizarRegistroElaboracion,
  obtenerRegistrosElaboracion
} = require('../helpers/lote-produccion.helper');
const Cultivo = require('../models/cultivo.model');
const DetalleElaboracionVariante = require('../models/detalleElaboracion.model');
const Presentacion = require('../models/presentacion.model');
const Producto = require('../models/producto.model');
const Variedad = require('../models/variedad.model');
const RegistroElaboracion = require('../models/RegistroElaboracion.model');
const Tanque = require('../models/tanque.model');
const Variante = require('../models/variante.model');
const { crearPDFElaboracion } = require('../helpers/pdf-elaboracion.helper');
const Empresa = require('../models/empresa.model');
// ============================================
// CRUD PRINCIPAL
// ============================================

/**
 * POST /api/elaboracion/registrar
 * Registra una nueva elaboración
 */
const registrarElaboracion = async (req, res) => {
  try {
    const { empresaId, usuarioId } = req.usuario;
    const datosFormulario = req.body;
console.log(datosFormulario)
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
      console.log(resultado)
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
 * PUT /api/elaboracion/:id
 * Actualiza una elaboración existente (solo si NO está finalizada)
 */
const actualizarElaboracion = async (req, res) => {
  try {
    const { empresaId, usuarioId } = req.usuario;
    const { id } = req.params;
    const datosFormulario = req.body;

    // Verificar que el registro existe y pertenece a la empresa
    const registroExistente = await RegistroElaboracion.findOne({
      where: { id, empresaId }
    });

    if (!registroExistente) {
      return res.status(404).json({
        success: false,
        message: 'Registro no encontrado'
      });
    }

    // Verificar que NO esté finalizado
    if (registroExistente.finalizado) {
      return res.status(400).json({
        success: false,
        message: 'No se puede editar un registro finalizado'
      });
    }

    const resultado = await actualizarRegistroElaboracion(
      id,
      datosFormulario,
      empresaId,
      usuarioId
    );

    if (resultado.success) {
      return res.json({
        success: true,
        message: 'Registro actualizado exitosamente',
        data: resultado.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: resultado.error
      });
    }
  } catch (error) {
    console.error('Error al actualizar elaboración:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * PUT /api/elaboracion/:id/finalizar
 * Finaliza una elaboración (ya no se podrá editar)
 */
const finalizarElaboracion = async (req, res) => {
  try {
    const { empresaId, usuarioId } = req.usuario;
    const { id } = req.params;

    const resultado = await finalizarRegistroElaboracion(id, empresaId, usuarioId);

    if (resultado.success) {
      return res.json({
        success: true,
        message: 'Registro finalizado exitosamente',
        data: resultado.data
      });
    } else {
      return res.status(400).json({
        success: false,
        message: resultado.error
      });
    }
  } catch (error) {
    console.error('Error al finalizar elaboración:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * GET /api/elaboracion/listar
 * Lista registros de elaboración con filtros y paginación opcional.
 * Query params:
 *  - fechaDesde, fechaHasta, numeroLote, soloNoFinalizados
 *  - page (opcional)
 *  - limit (opcional)
 */
const listarElaboraciones = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { fechaDesde, fechaHasta, numeroLote, soloNoFinalizados, page, limit } = req.query;

    // Construcción de filtros
    const filtros = {
      empresaId,
      fechaDesde: fechaDesde || null,
      fechaHasta: fechaHasta || null,
      numeroLote: numeroLote || null,
      soloNoFinalizados: soloNoFinalizados === 'true'
    };

    // Si tiene paginación activa
    const usarPaginacion = page && limit;

    let registros;
    let total = 0;

    if (usarPaginacion) {
      const pagina = parseInt(page, 10);
      const tamanio = parseInt(limit, 10);
      const offset = (pagina - 1) * tamanio;

      const { filas, cantidad } = await obtenerRegistrosElaboracion({
        ...filtros,
        limit: tamanio,
        offset
      });

      registros = filas;
      total = cantidad;
    } else {
      // Sin paginación: obtener todos
      const resultado = await obtenerRegistrosElaboracion(filtros);
      registros = resultado;
      total = resultado.length;
    }

    return res.json({
      success: true,
      data: registros,
      total,
      paginado: usarPaginacion
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
 * GET /api/elaboracion/reporte/pdf
 * Genera un PDF con los registros de elaboración filtrados
 * Query params: fechaDesde, fechaHasta, numeroLote, soloNoFinalizados
 */
const generarReportePDF = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { fechaDesde, fechaHasta, numeroLote, soloNoFinalizados } = req.query;

    // Obtener información de la empresa
    const empresa = await Empresa.findOne({
      where: { id: empresaId },
      attributes: ['id', 'razonSocial', 'ruc', 'email', 'telefono']
    });

    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    // Construcción de filtros (igual que listarElaboraciones pero SIN paginación)
    const filtros = {
      empresaId,
      fechaDesde: fechaDesde || null,
      fechaHasta: fechaHasta || null,
      numeroLote: numeroLote || null,
      soloNoFinalizados: soloNoFinalizados === 'true'
    };

    // Obtener registros completos con todos los includes necesarios
    const registros = await RegistroElaboracion.findAll({
      where: construirWhere(filtros),
      include: [
        {
          model: Tanque,
          as: 'tanque',
          attributes: ['id', 'codigo', 'letraLote', 'descripcion']
        },
        {
          model: Cultivo,
          as: 'cultivo',
          attributes: ['id', 'codigo', 'nombre']
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
            }
          ]
        }
      ],
      order: [
        ['fechaElaboracion', 'ASC'],
        ['numeroLoteProduccion', 'ASC']
      ]
    });

    if (registros.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron registros con los filtros especificados'
      });
    }

    // Generar PDF
    const pdfDoc = crearPDFElaboracion(registros, {
      razonSocial: empresa.razonSocial,
      ruc: empresa.ruc,
      email: empresa.email,
      telefono: empresa.telefono
    });

    // Configurar headers para descarga
    const nombreArchivo = `Registro_Elaboracion_${fechaDesde || 'todos'}_${fechaHasta || 'todos'}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);

    // Stream del PDF a la respuesta
    pdfDoc.pipe(res);

  } catch (error) {
    console.error('Error al generar reporte PDF:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al generar reporte PDF',
      error: error.message
    });
  }
};

/**
 * Función auxiliar para construir el WHERE de Sequelize
 * (Reutilizar lógica del método listarElaboraciones)
 */
const construirWhere = (filtros) => {
  const { Op } = require('sequelize');
  const where = { empresaId: filtros.empresaId };

  if (filtros.fechaDesde && filtros.fechaHasta) {
    where.fechaElaboracion = {
      [Op.between]: [filtros.fechaDesde, filtros.fechaHasta]
    };
  } else if (filtros.fechaDesde) {
    where.fechaElaboracion = {
      [Op.gte]: filtros.fechaDesde
    };
  } else if (filtros.fechaHasta) {
    where.fechaElaboracion = {
      [Op.lte]: filtros.fechaHasta
    };
  }

  if (filtros.numeroLote) {
    where.numeroLoteProduccion = {
      [Op.like]: `%${filtros.numeroLote}%`
    };
  }

  if (filtros.soloNoFinalizados) {
    where.finalizado = false;
  }

  return where;
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
          model: Tanque,
          as: 'tanque',
          attributes: ['id', 'codigo', 'letraLote', 'descripcion']
        },
        {
          model: Cultivo,
          as: 'cultivo',
          attributes: ['id', 'codigo', 'nombre']
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
 * DELETE /api/elaboracion/:id
 * Elimina una elaboración (solo si NO está finalizada)
 */
const eliminarElaboracion = async (req, res) => {
  try {
    const { empresaId } = req.usuario;
    const { id } = req.params;

    const registro = await RegistroElaboracion.findOne({
      where: { id, empresaId }
    });

    if (!registro) {
      return res.status(404).json({
        success: false,
        message: 'Registro no encontrado'
      });
    }

    if (registro.finalizado) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un registro finalizado'
      });
    }

    // Eliminar detalles primero
    await DetalleElaboracionVariante.destroy({
      where: { registroElaboracionId: id }
    });

    // Eliminar registro
    await registro.destroy();

    return res.json({
      success: true,
      message: 'Registro eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar elaboración:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar registro',
      error: error.message
    });
  }
};

// ============================================
// MAESTROS SIMPLIFICADOS
// ============================================

/**
 * GET /api/elaboracion/maestros/tanques
 * Obtiene lista de tanques fermentadores activos
 */
const listarTanques = async (req, res) => {
  try {
    const { empresaId } = req.usuario;

    const tanques = await Tanque.findAll({
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
 * Obtiene lista de cultivos activos (SIN lotes)
 */
const listarCultivos = async (req, res) => {
  try {
    const { empresaId } = req.usuario;

    const cultivos = await Cultivo.findAll({
      where: { empresaId, activo: true },
      attributes: ['id', 'codigo', 'nombre', 'descripcion'],
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
 * GET /api/elaboracion/maestros/variantes
 * Obtiene variantes disponibles para producción (con flag usaEsencia)
 */
const listarVariantesProduccion = async (req, res) => {
  try {
    const { empresaId } = req.usuario;

    const variantes = await Variante.findAll({
      where: { 
        empresaId, 
        activo: true,
        elaborable: true 
      },
      attributes: [
        'id', 
        'codBarra', 
        'codErp', 
        'usaEsencia'  // ⭐ Campo nuevo
      ],
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

// ============================================
// REPORTES
// ============================================

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
          model: Tanque,
          as: 'tanque',
          attributes: ['codigo', 'descripcion']
        },
        {
          model: Cultivo,
          as: 'cultivo',
          attributes: ['codigo', 'nombre']
        },
        {
          model: DetalleElaboracionVariante,
          as: 'detalles',
          include: [
            {
              model: Variante,
              as: 'variante',
              include: [
                { model: Producto, as: 'producto' },
                { model: Variedad, as: 'variedad' },
                { model: Presentacion, as: 'presentacion' }
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

/**
 * GET /api/elaboracion/reporte/pendientes
 * Lista elaboraciones no finalizadas
 */
const reportePendientes = async (req, res) => {
  try {
    const { empresaId } = req.usuario;

    const registros = await RegistroElaboracion.findAll({
      where: {
        empresaId,
        finalizado: false
      },
      include: [
        {
          model: Tanque,
          as: 'tanque',
          attributes: ['codigo']
        },
        {
          model: Cultivo,
          as: 'cultivo',
          attributes: ['nombre']
        }
      ],
      order: [['fechaElaboracion', 'DESC']],
      limit: 50
    });

    return res.json({
      success: true,
      data: registros,
      total: registros.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener pendientes',
      error: error.message
    });
  }
};

// ============================================
// EXPORTS
// ============================================
module.exports = {
  // CRUD
  registrarElaboracion,
  actualizarElaboracion,
  finalizarElaboracion,
  listarElaboraciones,
  obtenerDetalleElaboracion,
  eliminarElaboracion,
  
  // Maestros
  listarTanques,
  listarCultivos,
  listarVariantesProduccion,
  
  // Reportes
  reporteDiario,
  reportePendientes,
  generarReportePDF  
};