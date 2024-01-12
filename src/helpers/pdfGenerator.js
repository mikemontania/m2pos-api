const fs = require("fs");
const PDFDocument = require("pdfkit");
const {
  generarCabecera,
  generarDatosCliente,
  generarDetalles,
  generarAhorro,
  generarTotalTexto,
  generarIva
} = require("./pdf-helpers.js"); 

const createInvoice = (cabecera, detalles) => {
  const doc = new PDFDocument({
    margin: 50,
    size: "letter", //  el tamaño de hoja,   'letter' o { width, height }
    layout: "portrait" // Puedes establecer 'portrait' (vertical) o 'landscape' (horizontal)
  });
  generarCabecera(doc, cabecera);
  generarDatosCliente(doc, cabecera); 
  generarDetalles(doc, detalles);
  generarAhorro(doc, cabecera.importeDescuento);
  generarTotalTexto(doc, cabecera.importeTotal);
  generarIva(doc, cabecera);

  doc.end();
  return doc;
};

module.exports = { createInvoice };
