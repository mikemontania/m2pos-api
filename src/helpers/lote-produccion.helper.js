// ============================================
// HELPER: Generación y validación de lotes (OPTIMIZADO)
// ============================================

/**
 * Genera número de lote según formato LDDMMAAANNX
 * @param {Date} fechaElaboracion - Fecha de elaboración
 * @param {string} codigoEnvasado - 01, 02, 03
 * @param {string} letraTanque - Letra del tanque
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
 * @param {Date} fechaElaboracion
 * @param {string} codigoEnvasado - 01, 02, 03
 * @returns {Date}
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
 * @returns {Object}
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
 * Valida rangos de temperatura
 * @param {number} temperatura
 * @returns {boolean}
 */
function validarTemperaturaCultivo(temperatura) {
  return temperatura >= 41 && temperatura <= 44;
}
/**
 * Valida rangos de temperatura Pasteurizacion
 * @param {number} temperatura
 * @returns {boolean}
 */
function validarTemperaturaPasteurizacion(temperatura) {
  return temperatura >= 0 && temperatura <= 90;
}
/**
 * Valida rangos de temperatura Fermentacion
 * @param {number} temperatura
 * @returns {boolean}
 */
function validarTemperaturaFermentacion(temperatura) {
  return temperatura >= 0 && temperatura <= 90;
}
/**
 * Valida rango de pH
 * @param {number} ph
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
// PROCESAMIENTO DE REGISTROS
// ============================================

/**
 * Procesa datos para crear registro de elaboración
 * @param {Object} datosFormulario
 * @param {number} empresaId
 * @param {number} usuarioId
 * @returns {Object}
 */
async function procesarCargaPlanilla(datosFormulario, empresaId, usuarioId) {
  const Tanque = require('../models/tanque.model');
  const Cultivo = require('../models/cultivo.model');
  const Variante = require('../models/variante.model');
  
  const {
    fechaElaboracion,
    tanqueId,
    cultivoId,  // ⭐ CAMBIO: Ya no es loteCultivoId
    numeroLoteCultivo,  // ⭐ NUEVO: Campo texto
    fechaVencimientoCultivo,  // ⭐ NUEVO: Opcional
    cantidadLitros,
    horaCultivo,
    temperaturaCultivo,
    temperaturaPasteurizacion,temperaturaFermentacion,
    phMaduracion,
    horaFiltrado,
    codigoEnvasado = '01',
    realizadoPor,
    variantes = [],  // Array de { varianteId, cantidad, numeroLoteEsencia?, fechaVencimientoEsencia?, diasVida? }
    observaciones
  } = datosFormulario;
  
  // Validaciones
  if (!validarTemperaturaCultivo(temperaturaCultivo)) {
    throw new Error('Temperatura de cultivo debe estar entre 41°C y 44°C');
  }
    // Validaciones
  if (!validarTemperaturaFermentacion(temperaturaFermentacion)) {
    throw new Error('Temperatura de cultivo debe estar entre 0°C y 43°C');
  }
    // Validaciones
  if (!validarTemperaturaPasteurizacion(temperaturaPasteurizacion)) {
    throw new Error('Temperatura de cultivo debe estar entre 0°C y 80°C');
  }
  
  if (!validarPHMaduracion(phMaduracion)) {
    throw new Error('pH de maduración debe estar entre 4.7 y 4.8');
  }
  
  // Validar que el cultivo existe
  const cultivo = await Cultivo.findByPk(cultivoId);
  if (!cultivo) {
    throw new Error('Cultivo no encontrado');
  }
  
  // Validar que el número de lote no esté vacío
  if (!numeroLoteCultivo || numeroLoteCultivo.trim() === '') {
    throw new Error('Debe ingresar el número de lote del cultivo');
  }
  
  // Obtener tanque para obtener la letra
  const tanque = await Tanque.findByPk(tanqueId);
  if (!tanque) {
    throw new Error('Tanque fermentador no encontrado');
  }
  
  // Generar número de lote de producción
  const numeroLoteProduccion = generarNumeroLote(
    fechaElaboracion,
    codigoEnvasado,
    tanque.letraLote
  );
  
  // Calcular fecha de envasado
  const fechaEnvasado = calcularFechaEnvasado(fechaElaboracion, codigoEnvasado);
  
  // Validar variantes y sus campos de esencia
  for (const v of variantes) {
    const variante = await Variante.findByPk(v.varianteId);
    
    if (!variante) {
      throw new Error(`Variante ${v.varianteId} no encontrada`);
    }
    
    // ⭐ Si la variante usa esencia, validar campos
    if (variante.usaEsencia) {
      /* if (!v.numeroLoteEsencia || v.numeroLoteEsencia.trim() === '') {
        throw new Error(`La variante ${variante.id} requiere número de lote de esencia`);
      } */
      if (!v.fechaVencimientoEsencia) {
        throw new Error(`La variante ${variante.id} requiere fecha de vencimiento de esencia`);
      }
    }
  }
  
  // Estructura para insertar
  const registroElaboracion = {
    fechaElaboracion,
    numeroLoteProduccion,
    tanqueId,
    cultivoId,  // ⭐ CAMBIO
    numeroLoteCultivo,  // ⭐ NUEVO
    fechaVencimientoCultivo: fechaVencimientoCultivo || null,  // ⭐ NUEVO
    cantidadLitros,
    horaCultivo,
    temperaturaCultivo,   temperaturaPasteurizacion,temperaturaFermentacion, 
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
    cantidad: v.cantidad,
    fechaVencimiento: calcularFechaVencimientoProducto(fechaEnvasado, v.diasVida || 30),
    numeroLoteEsencia: v.numeroLoteEsencia || null,  // ⭐ NUEVO
    fechaVencimientoEsencia: v.fechaVencimientoEsencia || null,  // ⭐ NUEVO
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
    console.log(error)
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Actualiza un registro existente (solo si NO está finalizado)
 * @param {number} registroId
 * @param {Object} datosFormulario
 * @param {number} empresaId
 * @param {number} usuarioId
 * @returns {Promise<Object>}
 */
async function actualizarRegistroElaboracion(registroId, datosFormulario, empresaId, usuarioId) {
  const RegistroElaboracion = require('../models/RegistroElaboracion.model');
  const DetalleElaboracionVariante = require('../models/detalleElaboracion.model');
  const { sequelize } = require('../../dbconfig');
  
  try {
    const resultado = await sequelize.transaction(async (t) => {
      // Verificar que existe y no está finalizado
      const registroExistente = await RegistroElaboracion.findOne({
        where: { id: registroId, empresaId },
        transaction: t
      });
      
      if (!registroExistente) {
        throw new Error('Registro no encontrado');
      }
      
      if (registroExistente.finalizado) {
        throw new Error('No se puede editar un registro finalizado');
      }
      
      // Procesar datos
      const { registroElaboracion, detallesVariantes } = await procesarCargaPlanilla(
        datosFormulario,
        empresaId,
        usuarioId
      );
      
      // Actualizar registro de elaboración
      await registroExistente.update(registroElaboracion, { transaction: t });
      
      // Eliminar detalles anteriores
      await DetalleElaboracionVariante.destroy({
        where: { registroElaboracionId: registroId },
        transaction: t
      });
      
      // Crear nuevos detalles
      const detallesConRegistro = detallesVariantes.map(d => ({
        ...d,
        registroElaboracionId: registroId
      }));
      
      await DetalleElaboracionVariante.bulkCreate(detallesConRegistro, { 
        transaction: t 
      });
      
      return registroExistente;
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
 * Finaliza un registro (ya no se podrá editar)
 * @param {number} registroId
 * @param {number} empresaId
 * @param {number} usuarioId
 * @returns {Promise<Object>}
 */
async function finalizarRegistroElaboracion(registroId, empresaId, usuarioId) {
  const RegistroElaboracion = require('../models/RegistroElaboracion.model');
  
  try {
    const registro = await RegistroElaboracion.findOne({
      where: { id: registroId, empresaId }
    });
    
    if (!registro) {
      throw new Error('Registro no encontrado');
    }
    
    if (registro.finalizado) {
      throw new Error('El registro ya está finalizado');
    }
    
    await registro.update({
      finalizado: true,
      fechaFinalizacion: new Date(),
      usuarioFinalizacionId: usuarioId
    });
    
    return {
      success: true,
      data: registro
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
 * @param {Object} filtros
 * @returns {Promise<Array>}
 */
async function obtenerRegistrosElaboracion(filtros) {
  const RegistroElaboracion = require('../models/RegistroElaboracion.model');
  const DetalleElaboracionVariante = require('../models/detalleElaboracion.model');
  const Cultivo = require('../models/cultivo.model');
  const Tanque = require('../models/tanque.model');
  const Variante = require('../models/variante.model');
  const Producto = require('../models/producto.model');
  const Presentacion = require('../models/presentacion.model');
  const Variedad = require('../models/variedad.model');
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
  
  // ⭐ NUEVO: Filtrar solo no finalizados
  if (filtros.soloNoFinalizados) {
    where.finalizado = false;
  }
  
  const registros = await RegistroElaboracion.findAll({
    where,
    include: [
      {
        model: Tanque,
        as: 'tanque',
        attributes: ['id', 'codigo', 'letraLote', 'descripcion']
      },
      {
        model: Cultivo,  // ⭐ CAMBIO: Relación directa
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
              { model: Producto, as: 'producto' },
              { model: Presentacion, as: 'presentacion' },
              { model: Variedad, as: 'variedad' }
            ]
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
  validarTemperaturaPasteurizacion,  validarTemperaturaFermentacion,  
  validarPHMaduracion,
  calcularFechaVencimientoProducto,
  procesarCargaPlanilla,
  guardarRegistroElaboracion,
  actualizarRegistroElaboracion,   
  finalizarRegistroElaboracion,  
  obtenerRegistrosElaboracion
};