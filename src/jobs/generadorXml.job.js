const cron = require("node-cron");
  // Asegúrate de importar el modelo adecuado
 const Documento = require("../models/documento.model"); 
const Sucursal = require("../models/sucursal.model");
const Cliente = require("../models/cliente.model");
const TablaSifen = require("../models/tablaSifen.model"); 
require("dotenv").config(); // Cargar variables de entorno 
 const CondicionPago = require("../models/condicionPago.model");
const Variante = require("../models/variante.model");
const Presentacion = require("../models/presentacion.model");
const Variedad = require("../models/variedad.model");
const Producto = require("../models/producto.model");
const Unidad = require("../models/unidad.model");
const DocumentoDetalle = require("../models/documentoDetalle.model"); 
const { formatToParams, formatToData } = require("../metodosSifen/service/formatData.service");
const { generateXMLDE } = require("../metodosSifen/service/jsonDeMain.service"); 
const { normalizeXML } = require("../metodosSifen/service/util");
const { signXML } = require("../metodosSifen/service/signxml.service");
const { generateQR } = require("../metodosSifen/service/generateQR.service");
const { crearDocumentoXml } = require("../controllers/documentoXml-controller");
const ClienteSucursal = require("../models/ClienteSucursal.model");

const obtenerDocumentosPendientes = async () => {
  try {
    // Obteniendo las documentos pendientes
    const documentos = await Documento.findAll({
      where: { estado: 'Pendiente', anulado:false }, // Filtra por documentos pendientes
      include: [
        { model: Sucursal, as: 'sucursal' },
        { model: CondicionPago, as: 'condicionPago' },
        { model: Cliente, as: 'cliente' },
        { model: ClienteSucursal, as: 'clienteSucursal' },
        { model: TablaSifen, as: 'tipoDocumento' }
      ],
      raw: true,
      nest: true
    });

    // Inicializando los totales
    let totalImporteIva5 = 0;
    let totalImporteIva10 = 0;
    let totalImporteIvaexe = 0;

    // Obteniendo detalles de cada documento y sus productos
    const documentosCompletas = await Promise.all(
      documentos.map(async (documento) => {
        const detalles = await DocumentoDetalle.findAll({
          where: { documentoId: documento.id },
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
        documento.importeDescuento= +(documento.importeDescuento),
        documento.importeNeto= +(documento.importeNeto),
        documento.importeSubtotal= +(documento.importeSubtotal),
        documento.importeTotal= +(documento.importeTotal),
        // Procesando cada detalle
        documento.detalles = detalles.map((detalle) => {
          
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

        return documento; // Retornar la documento con sus detalles
      })
    );

    // Imprimiendo las documentos completas
  //  console.log('documentosCompletas<================================================>');
     
   // console.log(JSON.stringify(documentosCompletas, null, 2));//mostrar json en consola

   // console.log('<================================================>');
    return documentosCompletas; // Retornar el resultado final
  } catch (error) {
    console.error('Error al obtener documentos pendientes:', error);
  }
}; 
// Función para generar registros xml
const generarXml = async ( empresasXml) => {
  console.log('***************************************************************');
  console.log('🔍 Procesando facturas, se generan xml y firma de facturas no anuladas...');
  try { 
    await Promise.all(
      empresasXml.map(async (empresa) => { 

        const documentosPendientes = await obtenerDocumentosPendientes(empresa.id);
        if (!documentosPendientes?.length) {
          console.warn(`⚠️ No se encontraron documentos pendientes para empresa ${empresa.razonSocial} id ${empresa.id}.`);
          return;
        } 
        await Promise.all(
          documentosPendientes.map(async (documento) => {
            try {

              const params = await formatToParams(documento,empresa); 
              const data = await formatToData(documento,empresa);  
              let xmlBase = await generateXMLDE(params,data);  
              xmlBase =    normalizeXML(xmlBase);          
              xmlBase = xmlBase.replace('<?xml version="1.0" encoding="UTF-8"?>', "")
              await crearDocumentoXml(empresa.id, documento.id, xmlBase, 1  ,'GENERADO'  )  
              const xmlFirmado =await signXML(xmlBase,empresa.certificado) 
              const xmlFirmadoConQr =await generateQR(xmlFirmado,  empresa.idCSC,  empresa.csc);
              console.log('Este es el xml xmlFirmadoConQr =>',xmlFirmadoConQr)
              await crearDocumentoXml(empresa.id, documento.id, xmlFirmadoConQr, 2  ,'FIRMADO'  ) 
              const estado = xmlFirmadoConQr ? 'Procesado' : 'Error'; 
             const documentoUpd = await Documento.update(
                {
                   estado,
                 
                },
                {
                  where: { id: documento.id }
                }
              );

               
              console.log(
                xmlFirmadoConQr?.length
                  ? `✅ Documento con CDC ${documento.cdc}, comprobante ${documento.nroComprobante} procesado con éxito.`
                  : `❌ Error al generar XML para CDC ${documento.cdc}, comprobante ${documento.nroComprobante}.`
              );
            } catch (error) {
              console.error(`❌ Error procesando la documento ${documento.id}:`, error);
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
