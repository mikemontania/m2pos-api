const cron = require("node-cron");
  // Asegúrate de importar el modelo adecuado
const moment = require("moment");
const Venta = require("../models/venta.model");
const Empresa = require("../models/empresa.model");
require("dotenv").config(); // Cargar variables de entorno
const { Op } = require("sequelize");
const { loadCertificateAndKey } = require("../metodosSifen/obtenerCertificado");
const VentaXml = require("../models/ventaXml.model");

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
const obtenerVentasProcesadas = async () => {
  try {
    // Obteniendo las ventas pendientes
    const ventas = await Venta.findAll({
      where: { estado: 'Procesado' }, // Filtra por ventas pendientes
      raw: true,
      nest: true
    });

     
    return ventas; // Retornar el resultado final
  } catch (error) {
    console.error('Error al obtener ventas pendientes:', error);
  }
}; 
// Función para generar registros xml
const envioSifen = async () => {
  console.log('***************************************************************')
  console.log('🔍 Ejecutando generador xml...')
  try {
    //primero es necesario crear una funcion que retorne las empresas a las que se generan los xml con sus datos para facturacion electronica
    const empresasXml = await getEmpresasXml()
    if (empresasXml && empresasXml?.length > 0) {
      console.log(`✅ Se encontraron ${empresasXml.length} empresas.`)
      //permite ejecutar varias promesas en paralelo de manera eficiente
      await Promise.all(
        empresasXml.map(async empresa => {
          if (empresa.certificado) {
            // Obtener ventas
            const ventasProcesadas = await obtenerVentasProcesadas(empresa.id)
            if (ventasProcesadas?.length > 0 ){
              for (let index = 0; index < ventasProcesadas.length; index++) {
                
              
                const registro1 = await VentaXml.create({
                  id: null,
                  orden: 1,
                  empresaId:  empresa.id,
                  ventaId:  ventasPendientes[index].id,
                  estado: 'GENERADO',
                    xml,
                });
               
                console.log('Este es el xml xmlFirmadoConQr =>',xmlFirmadoConQr)
                const registro2 = await VentaXml.create({
                  id: null,
                  orden: 1,
                  empresaId:  empresa.id,
                  ventaId:  ventasPendientes[index].id,
                  estado: 'FIRMADO',
                  xml:xmlFirmadoConQr,
                }); 
                const registroVenta = await Venta.findByPk(ventasPendientes[index].id);
                if (registroVenta) {
                  await registroVenta.update({  estado:'Procesado' });
                  console.log(`✅ Venta con cdc ${ventasPendientes[index].cdc}  comprobante: ${ventasPendientes[index].nroComprobante}procesado con exito `)
                } else {
                  console.error(`❌ id de venta desconocido: ${ventasPendientes[index].id}`)
                }
          
              } 
              console.log(`✅ XML generado y firmado para empresa ${empresa.id}`)
            }else{
              console.warn(
                `⚠️ No se encontraron ventas pendientes`
              )
            } 


          } else {
            console.error(`❌ Empresa ${empresa.id} no posee certificado válido!!`)
          }
        })
      )
    } else {
      console.log('⏳ No hay ventas pendientes en este momento.')
    }
  } catch (error) {
    console.error('❌ Error al revisar ventas pendientes:', error)
  }
}

// Revisar si la tarea debe ejecutarse
const activarTarea = process.env.ENABLE_VENTAS_JOB === "true";

if (activarTarea) {
  cron.schedule("*/30 * * * *", generarXml, {
    scheduled: true,
    timezone: "America/Asuncion",
  });

  console.log("✅ Tarea programada para revisar ventas pendientes cada 30 minutos.");
} else {
  console.log("❌ Tarea de revisión de ventas desactivada por configuración.");
}
