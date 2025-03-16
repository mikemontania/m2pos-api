const fs = require("fs");
const PDFDocument = require("pdfkit");
const { generarCabecera } = require("./generaSeccionCabecera.kude");
const { formatDate, titleCase, separarXmlData } = require("./util.kude");
const { generarSeccionGeneral } = require("./generaSeccionGenerales.kude");
const { generaSeccionDetalles } = require("./generaSeccionDetalles.kude");
const { generaSeccionSubTotal } = require("./generaSeccionSubTotal.kude");
const { generaSeccionQr } = require("./generaSeccionQr.kude");


const createKude = async (xmldata, xmlFirmado, img) => {
  return new Promise(async (resolve, reject) => {
  
  try {
    const {
      informacionGeneral,
      tipoDocumento,
      timbrado,
      establecimiento,
      punto,
      numero,
      datosDocumento
    } = await separarXmlData(xmldata);
    let doc = new PDFDocument({ size: "A4", margin: 20 });
    //console.log(xmlFirmado);
    let reportName = "";
    switch (tipoDocumento) {
      case 1:
        reportName = "factura";
        break;
      case 2:
        reportName = "facturaImportacion";
        break;
      case 3:
        reportName = "facturaExportacion";
        break;
      case 4:
        reportName = "autoFactura";
        break;
      case 5:
        reportName = "notaCredito";
        break;
      case 6:
        reportName = "notaDebito";
        break;
      case 7:
        reportName = "notaRemision";
        break;
      default:
        throw new Error({ error: "TipoDocumento no valido" });
    }
    //A4 (595.28 x 841.89)
  const hojaVerticalAlto =841.89;
  const hojaVerticalAncho =595.28;
  const margen =5
  const altoHedader =100;
  const altoGenereal =80;
  const altoDetalle =150;
  const altoSubTotal =80;
  const altoqr =120;
  const headerLineLeft = 20;
  const headerLineRight =hojaVerticalAncho-20;
  const headerLineTop = 10;
  const headerLineBottom = headerLineTop + altoHedader;
  const headerLineTotalTop =headerLineBottom+ altoDetalle+margen;
  const generalLineTop = headerLineBottom +margen; 
  const generalLineBottom = headerLineBottom +altoGenereal;
  const detalleLineTop = generalLineBottom + margen;
  const detalleLineBottom = detalleLineTop + altoDetalle;
  const subTotalLineTop = detalleLineBottom + margen;
  const subTotalLineBottom = subTotalLineTop + altoSubTotal;
  const qrLineTop = subTotalLineBottom + margen;
  const qrLineBottom = qrLineTop + altoqr;
   await generarCabecera(doc,datosDocumento, img,headerLineLeft,headerLineRight,headerLineTop,headerLineBottom);
   await generarSeccionGeneral(doc,datosDocumento ,headerLineLeft,headerLineRight, generalLineTop,generalLineBottom);
  await generaSeccionDetalles(doc,datosDocumento ,headerLineLeft,headerLineRight,detalleLineTop,detalleLineBottom);
  await generaSeccionSubTotal(doc,datosDocumento ,headerLineLeft,headerLineRight,subTotalLineTop,subTotalLineBottom); 
  await generaSeccionQr(doc,informacionGeneral ,headerLineLeft,headerLineRight,qrLineTop,qrLineBottom);  
    
    /*   generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc); */ 
//     doc.image('./test_qr.png', headerLineLeft+5, 15, {width: 80})
//  .text('Proportional to width', headerLineLeft+5, 0);
   
    doc.end();  
    resolve(doc); // Finaliza la promesa cuando todo está listo
  } catch (error) {
    console.error(error)
  }
})
};
 
 
module.exports = {
  createKude
};
