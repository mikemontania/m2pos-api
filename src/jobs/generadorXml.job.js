const cron = require("node-cron");
  // Asegúrate de importar el modelo adecuado
 const Venta = require("../models/venta.model"); 
const Sucursal = require("../models/sucursal.model");
const Cliente = require("../models/cliente.model");
const TablaSifen = require("../models/tablaSifen.model"); 
require("dotenv").config(); // Cargar variables de entorno 
 const FormaVenta = require("../models/formaVenta.model");
const Variante = require("../models/variante.model");
const Presentacion = require("../models/presentacion.model");
const Variedad = require("../models/variedad.model");
const Producto = require("../models/producto.model");
const Unidad = require("../models/unidad.model");
const VentaDetalle = require("../models/ventaDetalle.model"); 
const { formatToParams, formatToData } = require("../metodosSifen/service/formatData.service");
const { generateXMLDE } = require("../metodosSifen/service/jsonDeMain.service"); 
const { normalizeXML } = require("../metodosSifen/service/util");
const { signXML } = require("../metodosSifen/service/signxml.service");
const { generateQR } = require("../metodosSifen/service/generateQR.service");
const { crearVentaXml } = require("../controllers/ventaXml-controller");

const obtenerVentasPendientes = async () => {
  try {
    // Obteniendo las ventas pendientes
    const ventas = await Venta.findAll({
      where: { estado: 'Pendiente', anulado:false }, // Filtra por ventas pendientes
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
        venta.importeDescuento= +(venta.importeDescuento),
        venta.importeNeto= +(venta.importeNeto),
        venta.importeSubtotal= +(venta.importeSubtotal),
        venta.importeTotal= +(venta.importeTotal),
        // Procesando cada detalle
        venta.detalles = detalles.map((detalle) => {
          
          const importeIva5 = detalle.importeIva5 > 0 ? detalle.importeIva5 : 0;
          const importeIva10 = detalle.importeIva10 > 0 ? detalle.importeIva10 : 0;
          const importeIvaExenta = detalle.importeIvaExenta > 0 ? detalle.importeIvaExenta : 0;
          const descripcion =`${detalle.variante.producto.nombre} ${detalle.variante.presentacion.descripcion} ${detalle.variante.variedad.descripcion} ${detalle.variante.unidad.code}`

          // Sumando a los totales
          totalImporteIva5 += importeIva5;
          totalImporteIva10 += importeIva10;
          totalImporteIvaexe += importeIvaExenta;

          // Retornar los detalles procesados
          return {
            ...detalle,
            codigo: detalle.variante.codErp,
            descripcion,
            cantidad: +(detalle.cantidad),
            importePrecio: +(detalle.importePrecio),
            importeIva5,
            importeIva10,
            importeIvaExenta,
            porcIva: +(detalle.porcIva),
            porcDescuento: +(detalle.porcDescuento),
            importeDescuento: +(detalle.importeDescuento),
            importeNeto: +(detalle.importeNeto),
            importeSubtotal: +(detalle.importeSubtotal),
            importeTotal: +(detalle.importeTotal),
            anticipo: +(detalle.anticipo),
            totalKg: +(detalle.totalKg)
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
const generarXml = async ( empresasXml) => {
  console.log('***************************************************************');
  console.log('🔍 Procesando facturas, se generan xml y firma de facturas no anuladas...');
  try { 
    await Promise.all(
      empresasXml.map(async (empresa) => { 

        const ventasPendientes = await obtenerVentasPendientes(empresa.id);
        if (!ventasPendientes?.length) {
          console.warn(`⚠️ No se encontraron ventas pendientes para empresa ${empresa.razonSocial} id ${empresa.id}.`);
          return;
        } 
        await Promise.all(
          ventasPendientes.map(async (venta) => {
            try {

              const params = await formatToParams(venta,empresa); 
              const data = await formatToData(venta,empresa);  
              let xmlBase = await generateXMLDE(params,data);  
              xmlBase =    normalizeXML(xmlBase);          
              xmlBase = xmlBase.replace('<?xml version="1.0" encoding="UTF-8"?>', "")
              await crearVentaXml(empresa.id, venta.id, xmlBase, 1  ,'GENERADO'  )  
              const xmlFirmado =await signXML(xmlBase,empresa.certificado) 
              const xmlFirmadoConQr =await generateQR(xmlFirmado,  empresa.idCSC,  empresa.csc);
              console.log('Este es el xml xmlFirmadoConQr =>',xmlFirmadoConQr)
              await crearVentaXml(empresa.id, venta.id, xmlFirmadoConQr, 2  ,'FIRMADO'  ) 
              const estado = xmlFirmadoConQr ? 'Procesado' : 'Error'; 
             const ventaUpd = await Venta.update(
                {
                   estado,
                 
                },
                {
                  where: { id: venta.id }
                }
              );

               
              console.log(
                xmlFirmadoConQr?.length
                  ? `✅ Venta con CDC ${venta.cdc}, comprobante ${venta.nroComprobante} procesado con éxito.`
                  : `❌ Error al generar XML para CDC ${venta.cdc}, comprobante ${venta.nroComprobante}.`
              );
            } catch (error) {
              console.error(`❌ Error procesando la venta ${venta.id}:`, error);
            }
          })
        ); 
        console.log(`✅ XML generado y firmado para empresa ${empresa.id}`);
      })
    );
  } catch (error) {
    console.error('❌ Error Procesando facturas pendientes:', error);
  }
};

 

module.exports = {
  generarXml
};
