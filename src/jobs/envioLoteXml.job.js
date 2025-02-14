const cron = require("node-cron");
// Asegúrate de importar el modelo adecuado 
const Venta = require("../models/venta.model");
const Empresa = require("../models/empresa.model");
require("dotenv").config(); // Cargar variables de entorno
const { Op } = require("sequelize");
const { loadCertificateAndKey } = require("../metodosSifen/obtenerCertificado");
const VentaXml = require("../models/ventaXml.model");
const Envio = require("../models/envio.model");
const { enviarLote } = require("../metodosSifen/envioLote.service");
const EnvioVenta = require("../models/envioVenta");

const { extraerDatosRespuesta } = require("../metodosSifen/xmlToJson");
const minutos = 1;
const relacionarVentasConLote = async (loteId, ventasIds) => {
  try {
    const registros = ventasIds.map(ventaId => ({
      ventaId: ventaId,
      envioId: loteId
    }));

    await EnvioVenta.bulkCreate(registros);

    console.log(`🔗 Relación creada entre ${ventasIds.length} ventas y el lote ${loteId}`);
  } catch (error) {
    console.error("❌ Error al relacionar ventas con el lote:", error);
    throw error;
  }
};


const actualizarLote = async (loteId, respuesta, respuestaId) => {
  try {

    const json = await extraerDatosRespuesta(respuesta);

    console.log("json ", json)
    console.log("JSON.stringify ", JSON.stringify(json, null, 2));
    // Determinar estado basado en el código de respuesta
    const estado = json?.codigo === "0300" ? "RECIBIDO" : "RECHAZADO";
    const reintento = json?.codigo === "0300" ? false : true;
    const actualizado = await Envio.update(
      {
        estado: estado,
        numeroLote: json?.numeroLote,
        codigo:json?.codigo,
        obs:json?.observacion,
        respuestaId: respuestaId,
        reintentar: reintento
      },
      {
        where: { id: loteId }
      }
    );
    console.log(actualizado)
    console.log(`✅ Lote actualizado con ID: ${loteId}, Estado: ${estado}`);
    return {id:loteId,estado:estado,...json};
  } catch (error) {
    console.error("❌ Error al actualizar el lote:", error);
    throw error;
  }
};
const cargandoLote = async (empresaId) => {
  try {
    const envio = await Envio.create({
      estado: 'INIT',
      empresaId: empresaId,
      reintentar: true,  // Asumimos que se reintenta en caso de error
      tipo: 'LOTE',      // Tipo de envío (puedes cambiarlo según tu lógica)
      numeroLote: null,  // Se puede actualizar después
      respuestaId: null,
      respuestaConsultaId: null
    });

    console.log(`✅ Lote creado con ID: ${envio.id}`);
    return envio;
  } catch (error) {
    console.error('❌ Error al crear el lote:', error);
    throw error;
  }
};

const getEmpresasXml = async () => {
  const tablas = ['iTiDE', 'iTipTra', 'iTImp', 'iTipCont'];
  try {
    // Obtener empresas que generan XML
    const empresas = await Empresa.findAll({
      where: { envioXml: 'SI' },
      raw: true,
      nest: true
    });

    if (!empresas.length) return [];

    // Agregar datos SIFEN y actividades a cada empresa
    const empresasCompletas = await Promise.all(
      empresas.map(async (empresa, index) => {
        const certificado = await loadCertificateAndKey(empresa.id);
        return {
          ...empresa,
          certificado: certificado || null
        };
      })
    );

    /*  console.log('Empresas procesadas:', empresasCompletas); */
    return empresasCompletas;
  } catch (error) {
    console.error('❌ Error al obtener empresas:', error);
    return [];
  }
};
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
const envioSifen = async () => {
  console.log('***************************************************************');
  console.log('🔍 Ejecutando envio de XML...');
  try {
    const empresasXml = await getEmpresasXml();
    if (!empresasXml?.length) {
      console.log('⏳ No hay empresas con facturación electrónica.');
      return;
    }

    console.log(`✅ Se encontraron ${empresasXml.length} empresas.`);

    await Promise.all(
      empresasXml.map(async (empresa) => {
        if (!empresa.certificado) {
          console.error(`❌ Empresa ${empresa.id} no posee certificado válido!!`);
          return;
        }
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
          } else {
            console.warn(`⚠️ Fallo en el envío de ${xmls.length} XMLs.`);
            await actualizarEstadoVentas(ventasIds, 'Procesado');
          }

        }
      })
    );
  } catch (error) {
    console.error('❌ Error al revisar ventas pendientes:', error);
  }
}

// Revisar si la tarea debe ejecutarse
const activarTarea = process.env.ENABLE_VENTAS_JOB === "true";

if (activarTarea) {
  console.log(`✅ Tarea programada para enviar lotes de xml firmados cada ${minutos} minutos.`);
  cron.schedule(`*/${minutos} * * * *`, envioSifen, {
    scheduled: true,
    timezone: "America/Asuncion",
  });
} else {
  console.log("❌ Tarea de revisión para enviar lotes esta desactivada por configuración.");
}
