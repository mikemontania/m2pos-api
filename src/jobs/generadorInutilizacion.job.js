const cron = require("node-cron");
  // Asegúrate de importar el modelo adecuado 
const Venta = require("../models/venta.model");
const Empresa = require("../models/empresa.model");
 
require("dotenv").config(); // Cargar variables de entorno
const { Op } = require("sequelize");
const { loadCertificateAndKey } = require("../metodosSifen/obtenerCertificado");
const { inutilizarDoc } = require("../metodosSifen/InutilizarDocumento.service");
const { extraerDatosRespuesta } = require("../metodosSifen/xmlToJson");
const VentaXml = require("../models/ventaXml.model");
 
const minutos = 1;
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
const generarInutilizacion = async () => {
  console.log('***************************************************************');
  console.log('🔍 Ejecutando generador de inutilizaciones...');
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

        const ventasPendientes = await obtenerVentasPendientes(empresa.id);
        if (!ventasPendientes?.length) {
          console.warn(`⚠️ No se encontraron ventas pendientes para empresa ${empresa.id}.`);
          return;
        }

        await Promise.all(
          ventasPendientes.map(async (venta) => {
            try {
              const respuesta = await inutilizarDoc(venta.id,venta.nroComprobante,venta.timbrado, empresa );
             const json = await extraerDatosRespuesta(respuesta);
              console.log(json)
             const registroInutilizado = await VentaXml.create({
              id: null,
              orden: 3,
              empresaId:  empresa.id,
              ventaId:  venta.id,
              estado: 'CONCLUIDO',
                xml:respuesta,
            }); 
             const ventaUpd = await Venta.update(
                {
                   estado:json.estado,
                 
                },
                {
                  where: { id: venta.id }
                }
              );

               
              console.log(
                xml?.length
                  ? `✅ Venta con CDC ${venta.cdc} comprobante ${venta.nroComprobante}  con estado ${json.estado}.`
                  : `❌ Error al inutilizacion de comprobante ${venta.nroComprobante}.`
              );
            } catch (error) {
              console.error(`❌ Error inutilizando la venta ${venta.id}: =>`, error);
            }
          })
        ); 
        console.log(`✅ XML generado y firmado para empresa ${empresa.id}`);
      })
    );
  } catch (error) {
    console.error('❌ Error al revisar ventas pendientes:', error);
  }
};


// Revisar si la tarea debe ejecutarse
const activarTarea = process.env.ENABLE_VENTAS_JOB === "true";

if (activarTarea) {
  console.log(`✅ Tarea programada para revisar ventas pendientes a anular cada ${minutos} minutos.`);
  cron.schedule(`*/${minutos} * * * *`, generarInutilizacion, {
    scheduled: true,
    timezone: "America/Asuncion",
  });
 
} else {
  console.log("❌ Tarea de revisión de ventas desactivada por configuración.");
}
