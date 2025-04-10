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
} = require("./pdf-helpers-a4.js");

// Puedes establecer 'portrait' (vertical) o 'landscape' (horizontal)
const propiedades = [
  { hoja: "CARTA", size: [612, 792], orientacion: "portrait" },
  { hoja: "A4", size: [595.276, 841.89], orientacion: "portrait" },
  { hoja: "LEGAL", size: [612, 1008], orientacion: "portrait" }
];
const createInvoice = (cabecera, detalles) => {
  const modo =  propiedades[1];
  const doc = new PDFDocument({
    margin: 0,
    size: modo.size,
    layout: modo.orientacion
  });
  if (modo.hoja === "LEGAL") {
     
     generarCabecera(doc, cabecera, 30);
    generarDatosCliente(doc, cabecera, 120);
    generarDetalles(doc, detalles, 165);
    generarAhorro(doc, cabecera.importeDescuento, 435);
    generarTotalTexto(doc, cabecera.importeTotal, 450);
    generarIva(doc, cabecera, 465);
    generarCopia(doc, "Original", 480);
    dividirHoja(doc);
 
    generarCabecera(doc, cabecera, 520);
    generarDatosCliente(doc, cabecera, 610);
    generarDetalles(doc, detalles, 655);
    generarAhorro(doc, cabecera.importeDescuento, 925);
    generarTotalTexto(doc, cabecera.importeTotal, 940);
    generarIva(doc, cabecera, 955);
    generarCopia(doc, "Duplicado: Archivo", 970); 
  
  } else if (modo.hoja === "A4") {
    generarCabecera(doc, cabecera, 10);
    generarDatosCliente(doc, cabecera, 100);
    generarDetalles(doc, detalles, 145);
    generarAhorro(doc, cabecera.importeDescuento, 775);
    generarTotalTexto(doc, cabecera.importeTotal, 790);
    generarIva(doc, cabecera, 805);
    generarCopia(doc, "Original", 820); 
  
  }
  doc.end();
  return doc;
};

module.exports = { createInvoice };
