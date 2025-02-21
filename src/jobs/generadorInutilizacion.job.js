
  // Asegúrate de importar el modelo adecuado 
const Venta = require("../models/venta.model"); 
require("dotenv").config(); // Cargar variables de entorno
const { Op } = require("sequelize");
  const VentaXml = require("../models/ventaXml.model");
const { envioEventoXml, extraeRespEvento } = require("../metodosSifen/envioEvento.service");
   
const obtenerVentasPendientes = async () => {
  try {
    // Obteniendo las ventas pendientes
    const ventas = await Venta.findAll({
      where: { estado: 'Pendiente', anulado:true }, // Filtra por ventas pendientes 
      raw: true,
      nest: true
    });
 
    return ventas; // Retornar el resultado final
  } catch (error) {
    console.error('Error al obtener ventas pendientes:', error);
  }
}; 
// Función para generar registros xml
const generarInutilizacion = async (empresasXml) => {
  console.log('***************************************************************');
  console.log('🔍 Ejecutando generador de inutilizaciones...');
  try {
    
    await Promise.all(
      empresasXml.map(async (empresa) => { 
        const ventasPendientes = await obtenerVentasPendientes(empresa.id);
        if (!ventasPendientes?.length) {
          console.warn(`⚠️ No se encontraron ventas pendientes para empresa ${empresa.id}.`);
          return;
        }

        await Promise.all(
          ventasPendientes.map(async (venta) => {
            try { 

              const respuesta = await envioEventoXml(2,venta,empresa); 
              const json = await extraeRespEvento(respuesta);
              console.log(json)
             const registroInutilizado = await VentaXml.create({
              id: null,
              orden: 3,
              empresaId:  empresa.id,
              ventaId:  venta.id,
              estado: 'CONCLUIDO',
                xml:respuesta,
            }); 
            console.log(json)
             const ventaUpd = await Venta.update(
                {
                   estado:json.estado,
                 
                },
                {
                  where: { id: venta.id }
                }
              );
 
              console.log(
                respuesta?.length
                  ? `✅ Venta con CDC ${venta.cdc} comprobante ${venta.nroComprobante}  con estado ${json.estado}.`
                  : `❌ Error al inutilizacion de comprobante ${venta.nroComprobante}.`
              );
            } catch (error) {
              console.error(`❌ Error inutilizando la venta ${venta.id}: =>`, error);
            }
          })
        ); 
        console.log(`✅ inutilizacion: XML generado y firmado para empresa ${empresa.id}`);
      })
    );
  } catch (error) {
    console.error('❌ Error al revisar ventas pendientes de inutilizacion:', error);
  }
};
 

module.exports = {
  generarInutilizacion
};
