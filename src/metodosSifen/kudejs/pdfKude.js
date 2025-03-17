const PDFDocument = require('pdfkit')
const { generarCabecera } = require('./generaSeccionCabecera.kude')
const { separarXmlData } = require('./util.kude')
const { generarSeccionGeneral } = require('./generaSeccionGenerales.kude')
const { generaSeccionDetalles } = require('./generaSeccionDetalles.kude')
const { generaSeccionSubTotal } = require('./generaSeccionSubTotal.kude')
const { generaSeccionQr } = require('./generaSeccionQr.kude')

const createKude = async (xmldata, xmlFirmado, img) => {
  //tamaño de hoja
  //A4 (595.28 x 841.89)
  return new Promise(async (resolve, reject) => {
    try {
      const { informacionGeneral, datosDocumento } = await separarXmlData(
        xmldata
      )
      let doc = new PDFDocument({ size: 'A4', margin: 20 })

      const hojaVerticalAlto = 841.89;
      const hojaVerticalAncho = 595.28;
      const margen = 5;
      const altoHedader = 100;
      const altoGenereal = 80;
      const altoDetalle = 150;// este era el tammaño del detalle
      const altoSubTotal = 80;
      const altoqr = 90;
      const sectionLineLeft = 20;
      const sectionLineRight = hojaVerticalAncho - 20;
      const headerLineTop = 10;
      const headerLineBottom = headerLineTop + altoHedader;
      const generalLineTop = headerLineBottom + margen;
      const generalLineBottom = headerLineBottom + altoGenereal;
      const detalleLineTop = generalLineBottom + margen; 
    
      // cabecera kude Logo | datos emisor | datos timbrado
      await generarCabecera(
        doc,
        datosDocumento,
        img,
        sectionLineLeft,
        sectionLineRight,
        headerLineTop,
        headerLineBottom
      )
      // datos de generales: operacion | receptor
      await generarSeccionGeneral(
        doc,
        datosDocumento,
        sectionLineLeft,
        sectionLineRight,
        generalLineTop,
        generalLineBottom
      )
      //tablas de detalle
      //se obtiene dinamicamente el tamaño de alto de la tabla detalle
     const altoTablaDetalle = await generaSeccionDetalles(
        doc,
        datosDocumento,
        sectionLineLeft,
        sectionLineRight,
        detalleLineTop 
      )
      console.log('altoTablaDetalle',altoTablaDetalle);
      const subTotalLineTop = altoTablaDetalle + margen;
      const subTotalLineBottom = subTotalLineTop + altoSubTotal;
      const qrLineTop = subTotalLineBottom + margen;
      const qrLineBottom = qrLineTop + altoqr;
      //detalles de subtotal
      await generaSeccionSubTotal(
        doc,
        datosDocumento,
        sectionLineLeft,
        sectionLineRight,
        subTotalLineTop,
        subTotalLineBottom
      )
  
      // seccion qr
      await generaSeccionQr(
        doc,
        informacionGeneral,
        sectionLineLeft,
        sectionLineRight,
        qrLineTop,
        qrLineBottom
      )

      doc.end()
      resolve(doc) // Finaliza la promesa cuando todo está listo
    } catch (error) {
      console.error(error)
      reject(null)
    }
  })
}

module.exports = {
  createKude
}
