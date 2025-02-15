const cron = require("node-cron");
  // Asegúrate de importar el modelo adecuado
 const Venta = require("../models/venta.model"); 
const Sucursal = require("../models/sucursal.model");
const Cliente = require("../models/cliente.model");
const TablaSifen = require("../models/tablaSifen.model"); 
require("dotenv").config(); // Cargar variables de entorno
const { Op } = require("sequelize");
 const FormaVenta = require("../models/formaVenta.model");
const Variante = require("../models/variante.model");
const Presentacion = require("../models/presentacion.model");
const Variedad = require("../models/variedad.model");
const Producto = require("../models/producto.model");
const Unidad = require("../models/unidad.model");
const VentaDetalle = require("../models/ventaDetalle.model");
 const { generarXML } = require("../metodosSifen/generarXml"); 

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
              const xml = await generarXML(empresa, venta);
              const estado = xml?.length ? 'Procesado' : 'Error';

             const ventaUpd = await Venta.update(
                {
                   estado,
                 
                },
                {
                  where: { id: venta.id }
                }
              );

               
              console.log(
                xml?.length
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
