const fs = require("fs");
const PDFDocument = require("pdfkit");

const {
  generarCabecera,
  generarDatosCliente,
  generarDetalles,
  generarAhorro,
  generarTotalTexto,
  generarIva,
  generarCopia,
  dividirHoja
} = require("./pdf-helpers.js");

// Puedes establecer 'portrait' (vertical) o 'landscape' (horizontal)
const propiedades = [
  { hoja: "CARTA", size: [612, 792], orientacion: "portrait" },
  { hoja: "A4", size: [595.276, 841.89], orientacion: "portrait" },
  { hoja: "LEGAL", size: [612, 1008], orientacion: "portrait" }
];
const createInvoice = (cabecera, detalles) => {
  const doc = new PDFDocument({
    margin: 0,
    size: propiedades[2].size,
    layout: propiedades[2].orientacion
  });
  /********copia 1 */
  generarCabecera(doc, cabecera, 30);
  generarDatosCliente(doc, cabecera, 120);
  generarDetalles(doc, detalles, 165);
  generarAhorro(doc, cabecera.importeDescuento, 435);
  generarTotalTexto(doc, cabecera.importeTotal, 450);
  generarIva(doc, cabecera, 465);
  generarCopia(doc, "Original:Cliente", 480);
  dividirHoja(doc);
  /*******copia 2 */
  generarCabecera(doc, cabecera, 520);
  generarDatosCliente(doc, cabecera, 610);
  generarDetalles(doc, detalles, 655);
  generarAhorro(doc, cabecera.importeDescuento, 925);
  generarTotalTexto(doc, cabecera.importeTotal, 940);
  generarIva(doc, cabecera, 955);
  generarCopia(doc, "Duplicado: Archivo", 970);
  doc.end();
  return doc;
};

module.exports = { createInvoice };
