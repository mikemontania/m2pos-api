const cron = require("node-cron");
// Asegúrate de importar el modelo adecuado 
const Venta = require("../models/venta.model");
 require("dotenv").config(); // Cargar variables de entorno
const { Op } = require("sequelize");
 const VentaXml = require("../models/ventaXml.model"); 
const { enviarLote } = require("../metodosSifen/envioLote.service"); 
const { cargandoLote, actualizarLote, relacionarVentasConLote } = require("../metodosSifen/service/createLote.service");

 
const obtenerVentasProcesadas = async (empresaId) => {
  try {
    const ventas = await Venta.findAll({
      where: {
        empresaId,
        estado: 'Procesado',
      },
      attributes: ['id'],
      order: [['id', 'ASC']], // Ordena por ID ascendente (más antiguas primero)
      limit: 50, // Obtiene las primeras 50 ventas
      raw: true,
    });

    return ventas.map(venta => venta.id); // Retorna solo los IDs
  } catch (error) {
    console.error(`❌ Error al obtener ventas procesadas para empresa ${empresaId}:`, error);
    return [];
  }
};

const obtenerXmlsFirmados = async (empresaId, ventaIds) => {
  try {
    if (!ventaIds?.length) return [];

    const xmls = await VentaXml.findAll({
      where: {
        ventaId: { [Op.in]: ventaIds },
        empresaId,
        estado: 'FIRMADO',
      },
    });

    console.log(xmls);

    return xmls.map(registro => registro.xml.toString('utf8')); // Convertir cada XML a string
  } catch (error) {
    console.error('❌ Error al obtener XMLs firmados:', error);
    return [];
  }
};

const actualizarEstadoVentas = async (ventaIds, nuevoEstado) => {
  try {
    await Venta.update({ estado: nuevoEstado }, {
      where: { id: { [Op.in]: ventaIds } }
    });
    console.log(`✅ Ventas actualizadas a estado: ${nuevoEstado}`);
  } catch (error) {
    console.error('❌ Error al actualizar ventas:', error);
  }
};

// Función para generar registros xml
const envioLoteXml = async (empresasXml) => {
  console.log('***************************************************************');
  console.log('🔍 Ejecutando envio de XML...');
  try {
    
    await Promise.all(
      empresasXml.map(async (empresa) => {
        
        let enviado = 0;
        let ventasIds = [];
        //mientras no se haya enviado y no tengamos ids
        while (enviado !== 1 && ventasIds != []) {
          // Obtener ventas procesadas
          ventasIds = await obtenerVentasProcesadas(empresa.id);
          console.log('ventasIds', ventasIds)
          if (ventasIds?.length === 0) {
            console.log(`🚀 No hay más ventas por procesar para empresa ${empresa.id}.`);
            break;
          }
          console.log(`📄 Se procesarán ${ventasIds.length} ventas.`);
          // Obtener XMLs firmados de esas ventas
          const xmls = await obtenerXmlsFirmados(empresa.id, ventasIds);
          if (xmls.length === 0) {
            console.warn('⚠️ No se encontraron XMLs firmados para estas ventas.');
            break;
          }

          // Crear el lote
          let lote = await cargandoLote(empresa.id);

          // Enviar el lote y obtener respuesta
          let respuesta = await enviarLote(lote.id, xmls, empresa.certificado);
          if (enviado === 0) {
            enviado = 1; // Cambiar estado después de la primera iteración
          }
          // Actualizar el lote con la respuesta
          const loteActualizado = await actualizarLote(lote.id, respuesta.respuesta, respuesta.id);
          console.log(loteActualizado)
          // Crear relación entre el lote y las ventas
          await relacionarVentasConLote(lote.id, ventasIds);
          // Actualizar estado de las ventas según el resultado del envío
          if (loteActualizado.estado === "RECIBIDO") {
            console.log(`📨 Envío exitoso de ${xmls.length} XMLs.`);
            await actualizarEstadoVentas(ventasIds, 'Recibido');
          } else  if (loteActualizado.estado === "RECHAZADO") {
            console.warn(`⚠️ Fallo en el envío de ${lote.numeroLote} XMLs.`);
            await actualizarEstadoVentas(ventasIds, 'Rechazado');
          } else {
            console.warn(`⚠️ Fallo en el envío de ${lote.numeroLote} XMLs.`);
            await actualizarEstadoVentas(ventasIds, 'Rechazado');
          }

        }
      })
    );
  } catch (error) {
    console.error('❌ Error al revisar ventas pendientes:', error);
  }
}

 
module.exports = {
  envioLoteXml,
  actualizarEstadoVentas
};
