const cron = require("node-cron");
// Asegúrate de importar el modelo adecuado 
const Documento = require("../models/documento.model");
 require("dotenv").config(); // Cargar variables de entorno
const { Op } = require("sequelize");
 const DocumentoXml = require("../models/documentoXml.model"); 
const { enviarLote } = require("../metodosSifen/envioLote.service"); 
const { cargandoLote, actualizarLote, relacionarDocumentosConLote } = require("../metodosSifen/service/createLote.service");

 
const obtenerDocumentosProcesadas = async (empresaId) => {
  try {
    const documentos = await Documento.findAll({
      where: {
        empresaId,
        estado: 'Procesado',
      },
      attributes: ['id'],
      order: [['id', 'ASC']], // Ordena por ID ascendente (más antiguas primero)
      limit: 50, // Obtiene las primeras 50 documentos
      raw: true,
    });

    return documentos.map(documento => documento.id); // Retorna solo los IDs
  } catch (error) {
    console.error(`❌ Error al obtener documentos procesadas para empresa ${empresaId}:`, error);
    return [];
  }
};

const obtenerXmlsFirmados = async (empresaId, documentoIds) => {
  try {
    if (!documentoIds?.length) return [];

    const xmls = await DocumentoXml.findAll({
      where: {
        documentoId: { [Op.in]: documentoIds },
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

const actualizarEstadoDocumentos = async (documentoIds, nuevoEstado) => {
  try {
    await Documento.update({ estado: nuevoEstado }, {
      where: { id: { [Op.in]: documentoIds } }
    });
    console.log(`✅ Documentos actualizadas a estado: ${nuevoEstado}`);
  } catch (error) {
    console.error('❌ Error al actualizar documentos:', error);
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
        let documentosIds = [];
        //mientras no se haya enviado y no tengamos ids
        while (enviado !== 1 && documentosIds != []) {
          // Obtener documentos procesadas
          documentosIds = await obtenerDocumentosProcesadas(empresa.id);
          console.log('documentosIds', documentosIds)
          if (documentosIds?.length === 0) {
            console.log(`🚀 No hay más documentos por procesar para empresa ${empresa.id}.`);
            break;
          }
          console.log(`📄 Se procesarán ${documentosIds.length} documentos.`);
          // Obtener XMLs firmados de esas documentos
          const xmls = await obtenerXmlsFirmados(empresa.id, documentosIds);
          if (xmls.length === 0) {
            console.warn('⚠️ No se encontraron XMLs firmados para estas documentos.');
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
          // Crear relación entre el lote y las documentos
          await relacionarDocumentosConLote(lote.id, documentosIds);
          // Actualizar estado de las documentos según el resultado del envío
          if (loteActualizado.estado === "RECIBIDO") {
            console.log(`📨 Envío exitoso de ${xmls.length} XMLs.`);
            await actualizarEstadoDocumentos(documentosIds, 'Recibido');
          } else {
            console.warn(`⚠️ Fallo en el envío de ${lote.numeroLote} XMLs.`);
            await actualizarEstadoDocumentos(documentosIds, 'Rechazado');
          }

        }
      })
    );
  } catch (error) {
    console.error('❌ Error al revisar documentos pendientes:', error);
  }
}

 
module.exports = {
  envioLoteXml,
  actualizarEstadoDocumentos
};
