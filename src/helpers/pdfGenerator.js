const fs = require('fs');
const PDFDocument = require('pdfkit');
const {

  generarCabecera,
  generarDatosCliente,
  generarDetalles,
  generarAhorro,
  generarTotalTexto,
  generarIva,
} = require('./pdf-helpers.js');
const {venta} = require('../data/venta.js');



const createInvoice = (invoice, outputPath) => {
    const doc = new PDFDocument({
        margin: 50,
        size: 'letter',  // Aquí puedes especificar el tamaño de hoja, por ejemplo, 'letter' o { width, height }
        layout: 'portrait'  // Puedes establecer 'portrait' (vertical) o 'landscape' (horizontal)
      }); 
    const factura = {...venta}
    const detalles =[...factura.venta.detalle]
    generarCabecera(doc);
    generarDatosCliente(doc)
   // console.log(factura.venta)
    //console.log(detalles)
  generarDetalles(doc,detalles);
  generarAhorro(doc,factura.venta.importeDescuento);
  generarTotalTexto(doc, factura.venta.importeTotal );
  generarIva(doc, factura.venta );
 


  doc.end();
  return doc;
};

module.exports = { createInvoice };