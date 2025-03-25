const PDFDocument = require("pdfkit");
const { generarCabecera } = require("./generaSeccionCabecera.kude");
const { separarXmlData } = require("./util.kude");
const { generarSeccionGeneral } = require("./generaSeccionGenerales.kude");
const { generaSeccionDetalles } = require("./generaSeccionDetalles.kude");
const { generaSeccionSubTotal } = require("./generaSeccionSubTotal.kude");
const { generaSeccionQr } = require("./generaSeccionQr.kude");
 
const createKude = async (xmldata, xmlFirmado, img) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { informacionGeneral, datosDocumento } = await separarXmlData(xmldata);
      const detalles = datosDocumento.detalles || [];
      const itemsPorPagina = 17;
      const totalPaginas = Math.ceil(detalles.length / itemsPorPagina);

      let doc = new PDFDocument({ size: "A4", margin: 20 });
       console.log({ detalles, itemsPorPagina  ,totalPaginas  })
      for (let i = 0; i < totalPaginas; i++) {
        if (i > 0) doc.addPage(); // Agregar nueva página excepto en la primera iteración
        const inicio = i * itemsPorPagina;
        const fin = inicio + itemsPorPagina;
        const detallesPagina = detalles.slice(inicio, fin);
        console.log({ vuelta:i,inicio,fin,detallesPagina })

        const hojaVerticalAncho = 595.28;
        const margen = 5;
        const altoHedader = 100;
        const altoGenereal = 93;
        const altoDetalle = 412;
        const altoSubTotal = 80;
        const altoqr = 90;
        const sectionLineLeft = 20;
        const sectionLineRight = hojaVerticalAncho - 20;
        const headerLineTop = 10;
        const headerLineBottom = headerLineTop + altoHedader;
        const generalLineTop = headerLineBottom + margen;
        const generalLineBottom = headerLineBottom + altoGenereal;
        const detalleLineTop = generalLineBottom + margen;
        const detalleLineBottom = detalleLineTop + altoDetalle;
        await generarCabecera(doc, datosDocumento, img, sectionLineLeft, sectionLineRight, headerLineTop, headerLineBottom);
        await generarSeccionGeneral(doc, datosDocumento, sectionLineLeft, sectionLineRight, generalLineTop, generalLineBottom);
        await generaSeccionDetalles(doc, detallesPagina, sectionLineLeft, sectionLineRight, detalleLineTop, detalleLineBottom);
        
        const subTotalLineTop = detalleLineBottom + margen;
        const subTotalLineBottom = subTotalLineTop + altoSubTotal;
        const qrLineTop = subTotalLineBottom + margen;
        const qrLineBottom = qrLineTop + altoqr;

        await generaSeccionSubTotal(doc, datosDocumento, sectionLineLeft, sectionLineRight, subTotalLineTop, subTotalLineBottom);
        await generaSeccionQr(doc, informacionGeneral, sectionLineLeft, sectionLineRight, qrLineTop, qrLineBottom);
        
        doc.fontSize(10).font("Helvetica-Bold").text(`${i + 1}/${totalPaginas}`, sectionLineLeft + 540, qrLineBottom + 5);
      }

      doc.end();
      resolve(doc);
    } catch (error) {
      console.error(error);
      reject(null);
    }
  });
};

module.exports = { createKude };