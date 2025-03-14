 // Asegúrate de importar el modelo adecuado
 const Venta = require("../models/venta.model");
 require("dotenv").config(); // Cargar variables de entorno
const { Op ,literal} = require("sequelize"); 
const Envio = require("../models/envio.model"); 
const { extraerDatosRespuesta ,extraerRespuestasXml} = require("../metodosSifen/xmlToJson");
 const { consulta } = require("../metodosSifen/service/consulta.service");
const { crearVentaXml } = require("../controllers/ventaXml-controller");
  
const actualizarLote = async (loteId,json, respuestaId) => {
  try {

    console.log("JSON.stringify ", JSON.stringify(json, null, 2)); 
    // Determinar estado basado en el código de respuesta 
     const actualizado = await Envio.update(
      {
        estado: 'RESPONDIDO', 
        codigo:json?.codigo,
        obs:json?.observacion|| '',
        respuestaConsultaId: respuestaId,
        reintentar: false,
      },
      {
        where: { id: loteId }
      }
    ); 
  //  console.log(actualizado)
    console.log(`✅ Lote actualizado con ID: ${loteId}, Estado: RESPONDIDO`);  
    return {id:loteId,estado:'RESPONDIDO',...json};
  } catch (error) {
    console.error("❌ Error al actualizar el lote:", error);
    throw error;
  }
};
const actualizarVentasDesdeSifen = async (res) => {
  console.log('****************************actualizarVentasDesdeSifen**********************************************')
  console.log('res',res)
  const respuestas =  await  extraerRespuestasXml(res);
  console.log('respuestas',respuestas)
  try {
    for (const item of respuestas) {
      // Buscar la venta por CDC
      const ventas = await Venta.findAll({
        where: { cdc: item.id },
        attributes: ['id', 'empresaId','cdc'],
        order: [['id', 'ASC']],
        raw: true
      });

      if (!ventas.length) {
        console.warn(`No se encontró ninguna venta con CDC: ${item.id}`);
        continue;
      }

      for (const venta of ventas) {
        // Convertir la respuesta en XML (puedes cambiar esta función según tu implementación)
        const xmlRespuesta = convertirObjetoAXML(item); 
        // Crear un registro en VentaXml 
        await crearVentaXml(venta.empresaId,venta.id,xmlRespuesta,3,'RESPONDIDO');


        // Actualizar el estado de la venta
        await Venta.update(
          { estado: item.dEstRes },
          { where: { id: venta.id } }
        );
      }
    }
    console.log("Proceso completado con éxito.");
  } catch (error) {
    console.error("Error al actualizar ventas desde SIFEN:", error);
  }
};

// Función de ejemplo para convertir JSON a XML
const convertirObjetoAXML = (objeto) => {
  const builder = require('xmlbuilder');
  
  return builder
    .create('responseLote', { version: '1.0', encoding: 'UTF-8' }) // Agrega una etiqueta raíz y la codificación
    .ele(objeto) // Inserta los datos dentro de la raíz
    .end({ pretty: true }); // Formato legible
};
 
const obtenerLotesRecibidos = async (empresaId) => {
  try {
    const lotes = await Envio.findAll({
      where: {
        empresa_id: empresaId,
        estado: 'RECIBIDO',
        fecha_hora_envio: {
          [Op.lte]: literal("NOW() - INTERVAL '1 minutes'") // Registros con más de 10 minutos
        }
      },
       raw: true,
    });
    console.log(`✅ Lotes obtenidos =>: ${lotes?.length}`);
    return lotes;
  } catch (error) {
    console.error(`❌ Error al obtener lotes recibidos para empresa ${empresaId}:`, error);
    return [];
  }
};
  
// Función para generar registros xml
const consultaLoteXml = async (empresasXml) => {
  console.log('***************************************************************');
  console.log('🔍 Iniciado consula de lote...');
  try {
    
    await Promise.all(
      empresasXml.map(async (empresa) => {
        
       const  lotesPendientes = await obtenerLotesRecibidos(empresa.id);
            if (!lotesPendientes?.length) {
              console.warn(`⚠️ No se encontraron lotesPendientes  para empresa ${empresa.id}.`);
              return;
            }
    
            await Promise.all(
              lotesPendientes.map(async (lote) => {
                try {
                  console.log(lote)
                  
                  const data = {id:lote.id, numeroLote: lote.numeroLote,tipoConsulta:"LOTE"}
                  const respuesta = await consulta(data ,empresa.certificado);
                  console.log(respuesta);
                  const json = await extraerDatosRespuesta(respuesta.respuesta);
                  await actualizarVentasDesdeSifen(respuesta.respuesta); 
                  await actualizarLote(lote.id, json,  respuesta.id);
                  //console.log(loteActualizado)
                  console.log(`✅ Lote con id ${lote.numeroLote} se ha RESPONDIDO.` );  
                } catch (error) {
                  console.error(`❌ Error consultando lote la venta ${lote.id}:`, error); 
                }
              })
            ); 
            
      })
    );
  } catch (error) {
    console.error('❌ Error al revisar ventas pendientes:', error);
  }
}
 

module.exports = {
  consultaLoteXml
};

