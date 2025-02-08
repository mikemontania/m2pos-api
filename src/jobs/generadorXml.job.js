const cron = require("node-cron");
  // Asegúrate de importar el modelo adecuado
const moment = require("moment");
const Venta = require("../models/venta.model");
const Empresa = require("../models/empresa.model");
const Sucursal = require("../models/sucursal.model");
const Cliente = require("../models/cliente.model");
const TablaSifen = require("../models/tablaSifen.model");
const Departamento = require("../models/departamento.model");
const Ciudad = require("../models/ciudad.model");
const Barrio = require("../models/barrio.model");
const { forEach } = require("jszip");
const EmpresaActividad = require("../models/empresaActividad.model");
const Actividad = require("../models/actividad.model");
require("dotenv").config(); // Cargar variables de entorno
const { Op } = require("sequelize");
const { loadCertificateAndKey } = require("../metodosSifen/obtenerCertificado");
const FormaVenta = require("../models/formaVenta.model");
const Variante = require("../models/variante.model");
const Presentacion = require("../models/presentacion.model");
const Variedad = require("../models/variedad.model");
const Producto = require("../models/producto.model");
const Unidad = require("../models/unidad.model");
const VentaDetalle = require("../models/ventaDetalle.model");
const Moneda = require("../models/moneda.model");
const { generarXML } = require("../metodosSifen/generarXml");
const VentaXml = require("../models/ventaXml.model");
const { agregarFirmaXml } = require("../metodosSifen/agregarFirmaXml");
const { agregaQr } = require("../metodosSifen/agregaQr");
 

const getEmpresasXml = async () => {
  const tablas = ['iTiDE', 'iTipTra', 'iTImp', 'iTipCont'];
  try {
    // Obtener empresas que generan XML
    const empresas = await Empresa.findAll({
      where: { generarXml: 'SI' },
      include: [
        { model: Moneda, as: 'moneda' },
        { model: Departamento, as: 'departamento' },
        { model: Ciudad, as: 'ciudad' },
        { model: Barrio, as: 'barrio' }
      ],
      raw: true,
      nest: true
    });

    if (!empresas.length) return [];

     // Obtener registros SIFEN
    const registros = await TablaSifen.findAll({
      where: { tabla: { [Op.in]: tablas } },
      raw: true,
      nest: true
    });

    console.log("Obteniendo registros SIFEN... =>", registros?.length);
 
    //Uso de Promise.all() para obtener actividades en paralelo, evitando consultas innecesariamente secuenciales.
    const actividadesPorEmpresa = await Promise.all(
      empresas.map(empresa =>
        EmpresaActividad.findAll({
          where: { empresaId: empresa.id },
          include: [{ model: Actividad, as: "actividades" }],
          raw: true,
          nest: true
        }).then(data =>
          data.map(a => ({
            cActEco: a.actividades.codigo,
            dDesActEco: a.actividades.descripcion
          }))
        )
      )
    );

    // Agregar datos SIFEN y actividades a cada empresa
    const empresasCompletas = await Promise.all(
      empresas.map(async (empresa, index) => {
        const certificado = await loadCertificateAndKey(empresa.id);
        return {
          ...empresa,
          tipoContribuyente: registros.find(t => t.codigo == empresa.tipoContId && t.tabla === 'iTipCont'),
          tipoTransaccion: registros.find(t => t.codigo == empresa.tipoTransaId && t.tabla === 'iTipTra'),
          tipoImpuesto: registros.find(t => t.codigo == empresa.tipoImpId && t.tabla === 'iTImp'),
          actividades: actividadesPorEmpresa[index] || [],
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
      where: { estado: 'Pendiente' }, // Filtra por ventas pendientes
      include: [
        { model: Sucursal, as: 'sucursal' },
        { model: FormaVenta, as: 'formaVenta' },
        { model: Cliente, as: 'cliente' },
        { model: TablaSifen, as: 'tipoDocumento' }
      ],
      raw: true,
      nest: true
    });

    // Inicializando los totales
    let totalImporteIva5 = 0;
    let totalImporteIva10 = 0;
    let totalImporteIvaexe = 0;

    // Obteniendo detalles de cada venta y sus productos
    const ventasCompletas = await Promise.all(
      ventas.map(async (venta) => {
        const detalles = await VentaDetalle.findAll({
          where: { ventaId: venta.id },
          include: [
            {
              model: Variante,
              as: "variante",
              include: [
                { model: Presentacion, as: "presentacion", attributes: ["id", "descripcion", "size"] },
                { model: Variedad, as: "variedad", attributes: ["id", "descripcion", "color"] },
                { model: Producto, as: "producto", attributes: ["nombre"] },
                { model: Unidad, as: "unidad", attributes: ["code"] }
              ] 
            }
          ],
          raw: true,
          nest: true
        });

        // Procesando cada detalle
        venta.detalles = detalles.map((detalle) => {
          const importePrecio = detalle.importeTotal / detalle.cantidad; 
          const importeIva5 = detalle.importeIva5 > 0 ? detalle.importeIva5 : 0;
          const importeIva10 = detalle.importeIva10 > 0 ? detalle.importeIva10 : 0;
          const importeIvaExenta = detalle.importeIvaExenta > 0 ? detalle.importeIvaExenta : 0;

          // Sumando a los totales
          totalImporteIva5 += importeIva5;
          totalImporteIva10 += importeIva10;
          totalImporteIvaexe += importeIvaExenta;

          // Retornar los detalles procesados
          return {
            porcIva: detalle.porcIva,
            cantidad: detalle.cantidad,
            importePrecio,
            importeIva5,
            importeIva10,
            importeIvaExenta,
            importeTotal: detalle.importeTotal,
            totalKg: detalle.totalKg,
            tipoDescuento: detalle.tipoDescuento,
            variante: detalle.variante,
            presentacion: detalle.variante.presentacion,
            variedad: detalle.variante.variedad,
            producto: detalle.variante.producto,
            unidad: detalle.variante.unidad
          };
        });

        return venta; // Retornar la venta con sus detalles
      })
    );

    // Imprimiendo las ventas completas
  //  console.log('ventasCompletas<================================================>');
     
   // console.log(JSON.stringify(ventasCompletas, null, 2));//mostrar json en consola

   // console.log('<================================================>');
    return ventasCompletas; // Retornar el resultado final
  } catch (error) {
    console.error('Error al obtener ventas pendientes:', error);
  }
}; 
// Función para generar registros xml
const generarXml = async () => {
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
            const ventasPendientes = await obtenerVentasPendientes(empresa.id)
            if (ventasPendientes?.length > 0 ){
              for (let index = 0; index < ventasPendientes.length; index++) {
                
                const xml =await  generarXML(empresa,ventasPendientes[index])
                const registro1 = await VentaXml.create({
                  id: null,
                  orden: 1,
                  empresaId:  empresa.id,
                  ventaId:  ventasPendientes[index].id,
                  estado: 'GENERADO',
                    xml,
                });
                const xmlFirmado =await agregarFirmaXml(xml,empresa.certificado)
                const xmlFirmadoConQr =await agregaQr(xmlFirmado,  empresa.idCSC,  empresa.csc);
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
