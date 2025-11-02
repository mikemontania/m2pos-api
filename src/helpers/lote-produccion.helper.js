// ============================================
// HELPER: Generación y validación de lotes
// ============================================

/**
 * Genera número de lote según formato LDDMMAAANNX
 * @param {Date} fechaElaboracion - Fecha de elaboración
 * @param {string} codigoEnvasado - 01, 02, 03 (tarde, siguiente, día siguiente siguiente)
 * @param {string} letraTanque - Letra del tanque desde TanqueFermentador.letraLote
 * @returns {string} Número de lote (ej: L01092501A)
 */
function generarNumeroLote(fechaElaboracion, codigoEnvasado = '01', letraTanque) {
  const fecha = new Date(fechaElaboracion);
  
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = String(fecha.getFullYear()).slice(-2);
  
  const codigo = String(codigoEnvasado).padStart(2, '0');
  
  return `L${dia}${mes}${anio}${codigo}${letraTanque}`;
}

/**
 * Calcula fecha de envasado según código de envasado
 * @param {Date} fechaElaboracion - Fecha de elaboración
 * @param {string} codigoEnvasado - 01, 02, 03
 * @returns {Date} Fecha de envasado
 */
function calcularFechaEnvasado(fechaElaboracion, codigoEnvasado) {
  const fecha = new Date(fechaElaboracion);
  const codigo = String(codigoEnvasado).padStart(2, '0');
  
  switch(codigo) {
    case '01': // Tarde del día siguiente
      fecha.setDate(fecha.getDate() + 1);
      break;
    case '02': // Día siguiente
      fecha.setDate(fecha.getDate() + 1);
      break;
    case '03': // Día siguiente siguiente
      fecha.setDate(fecha.getDate() + 2);
      break;
    default:
      fecha.setDate(fecha.getDate() + 1);
  }
  
  return fecha;
}

/**
 * Parsea un número de lote y extrae información
 * @param {string} numeroLote - Ej: L01092501A
 * @returns {Object} Información del lote
 */
function parsearNumeroLote(numeroLote) {
  if (!numeroLote || !numeroLote.startsWith('L')) {
    throw new Error('Formato de lote inválido');
  }
  
  const dia = parseInt(numeroLote.substring(1, 3));
  const mes = parseInt(numeroLote.substring(3, 5));
  const anio = parseInt('20' + numeroLote.substring(5, 7));
  const codigoEnvasado = numeroLote.substring(7, 9);
  const tanque = numeroLote.substring(9);
  
  return {
    dia,
    mes,
    anio,
    fechaElaboracion: new Date(anio, mes - 1, dia),
    codigoEnvasado,
    tanque
  };
}

/**
 * Valida rangos de temperatura para cultivo
 * @param {number} temperatura - Temperatura en °C
 * @returns {boolean}
 */
function validarTemperaturaCultivo(temperatura) {
  return temperatura >= 41 && temperatura <= 44;
}

/**
 * Valida rango de pH para maduración
 * @param {number} ph - Valor de pH
 * @returns {boolean}
 */
function validarPHMaduracion(ph) {
  return ph >= 4.7 && ph <= 4.8;
}

/**
 * Calcula fecha de vencimiento del producto
 * @param {Date} fechaEnvasado
 * @param {number} diasVida - Días de vida útil (default: 30)
 * @returns {Date}
 */
function calcularFechaVencimientoProducto(fechaEnvasado, diasVida = 30) {
  const fecha = new Date(fechaEnvasado);
  fecha.setDate(fecha.getDate() + diasVida);
  return fecha;
}

// ============================================
// HELPER: Carga de planilla diaria
// ============================================

/**
 * Procesa datos de planilla para crear registro de elaboración
 * @param {Object} datosFormulario - Datos del formulario de tablet
 * @param {number} empresaId - ID de la empresa
 * @param {number} usuarioId - ID del usuario que carga
 * @returns {Object} Datos estructurados para insertar
 */
async function procesarCargaPlanilla(datosFormulario, empresaId, usuarioId) {
  const TanqueFermentador = require('../models/tanqueFermentador.model');
  
  const {
    fechaElaboracion,
    tanqueFermentadorId,
    loteCultivoId,
    cantidadLitros,
    horaCultivo,
    temperaturaCultivo,
    phMaduracion,
    horaFiltrado,
    codigoEnvasado = '01',
    realizadoPor,
    variantes = [], // Array de { varianteId, cantidad, loteEsenciaId?, diasVida? }
    observaciones
  } = datosFormulario;
  
  // Validaciones
  if (!validarTemperaturaCultivo(temperaturaCultivo)) {
    throw new Error('Temperatura de cultivo debe estar entre 41°C y 44°C');
  }
  
  if (!validarPHMaduracion(phMaduracion)) {
    throw new Error('pH de maduración debe estar entre 4.7 y 4.8');
  }
  
  // Obtener tanque para obtener la letra
  const tanque = await TanqueFermentador.findByPk(tanqueFermentadorId);
  if (!tanque) {
    throw new Error('Tanque fermentador no encontrado');
  }
  
  // Generar número de lote
  const numeroLoteProduccion = generarNumeroLote(
    fechaElaboracion,
    codigoEnvasado,
    tanque.letraLote
  );
  
  // Calcular fecha de envasado
  const fechaEnvasado = calcularFechaEnvasado(fechaElaboracion, codigoEnvasado);
  
  // Estructura para insertar
  const registroElaboracion = {
    fechaElaboracion,
    numeroLoteProduccion,
    tanqueFermentadorId,
    loteCultivoId,
    cantidadLitros,
    horaCultivo,
    temperaturaCultivo,
    phMaduracion,
    horaFiltrado,
    fechaEnvasado,
    realizadoPor,
    usuarioId,
    empresaId,
    observaciones
  };
  
  const detallesVariantes = variantes.map(v => ({
    varianteId: v.varianteId,
    loteEsenciaId: v.loteEsenciaId || null,
    cantidad: v.cantidad,
    fechaVencimiento: calcularFechaVencimientoProducto(fechaEnvasado, v.diasVida || 30),
    empresaId
  }));
  
  return {
    registroElaboracion,
    detallesVariantes
  };
}

/**
 * Guarda registro completo de elaboración
 * @param {Object} datosFormulario
 * @param {number} empresaId
 * @param {number} usuarioId
 * @returns {Promise<Object>}
 */
async function guardarRegistroElaboracion(datosFormulario, empresaId, usuarioId) {
  const RegistroElaboracion = require('../models/RegistroElaboracion.model');
  const DetalleElaboracionVariante = require('../models/detalleElaboracion.model');
  const { sequelize } = require('../../dbconfig');
  
  try {
    const resultado = await sequelize.transaction(async (t) => {
      // Procesar datos
      const { registroElaboracion, detallesVariantes } = await procesarCargaPlanilla(
        datosFormulario,
        empresaId,
        usuarioId
      );
      
      // Crear registro de elaboración
      const registro = await RegistroElaboracion.create(registroElaboracion, { 
        transaction: t 
      });
      
      // Crear detalles por variante
      const detallesConRegistro = detallesVariantes.map(d => ({
        ...d,
        registroElaboracionId: registro.id
      }));
      
      await DetalleElaboracionVariante.bulkCreate(detallesConRegistro, { 
        transaction: t 
      });
      
      return registro;
    });
    
    return {
      success: true,
      data: resultado
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Obtiene registros de elaboración con filtros
 * @param {Object} filtros - { empresaId, fechaDesde?, fechaHasta?, numeroLote? }
 * @returns {Promise<Array>}
 */
async function obtenerRegistrosElaboracion(filtros) {
  const RegistroElaboracion = require('../models/RegistroElaboracion.model');
  const DetalleElaboracionVariante = require('../models/detalleElaboracion.model');
  const LoteCultivo = require('../models/loteCultivo.model');
  const Cultivo = require('../models/cultivo.model');
  const TanqueFermentador = require('../models/tanqueFermentador.model');
  const Variante = require('../models/variante.model');
  const LoteEsencia = require('../models/loteEsencia.model');
  const Esencia = require('../models/esencia.models');
  const { Op } = require('sequelize');
  
  const where = { empresaId: filtros.empresaId };
  
  if (filtros.fechaDesde && filtros.fechaHasta) {
    where.fechaElaboracion = {
      [Op.between]: [filtros.fechaDesde, filtros.fechaHasta]
    };
  }
  
  if (filtros.numeroLote) {
    where.numeroLoteProduccion = filtros.numeroLote;
  }
  
  const registros = await RegistroElaboracion.findAll({
    where,
    include: [
      {
        model: TanqueFermentador,
        as: 'tanque',
        attributes: ['id', 'codigo', 'letraLote', 'descripcion']
      },
      {
        model: LoteCultivo,
        as: 'loteCultivo',
        include: [{ 
          model: Cultivo, 
          as: 'cultivo',
          attributes: ['id', 'codigo', 'nombre']
        }]
      },
      {
        model: DetalleElaboracionVariante,
        as: 'detalles',
        include: [
          {
            model: Variante,
            as: 'variante',
            include: ['producto', 'presentacion', 'variedad']
          },
          {
            model: LoteEsencia,
            as: 'loteEsencia',
            include: [{
              model: Esencia,
              as: 'esencia'
            }]
          }
        ]
      }
    ],
    order: [['fechaElaboracion', 'DESC']]
  });
  
  return registros;
}

module.exports = {
  generarNumeroLote,
  calcularFechaEnvasado,
  parsearNumeroLote,
  validarTemperaturaCultivo,
  validarPHMaduracion,
  calcularFechaVencimientoProducto,
  procesarCargaPlanilla,
  guardarRegistroElaboracion,
  obtenerRegistrosElaboracion
};