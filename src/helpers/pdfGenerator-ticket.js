const fs = require("fs");
const PDFDocument = require("pdfkit");

const {
  generarCabecera,
  generarDatosCliente,
  generarDetalles,
  generarAhorro,
  generarTotal,
  generarSubTotal,
  generarPagos,
  generarPuntos,
  generarPie
} = require("./pdf-helpers-ticket.js");

const createTicket = (tipo,cabecera, detalles) => {
  const doc = new PDFDocument({
    margin: 10,
    size: [226.77, 800], // 80mm
  });

  generarCabecera(doc, cabecera);
  generarDatosCliente(doc, cabecera);
  generarDetalles(doc, detalles);
  generarAhorro(doc, cabecera.importeDescuento);
  generarSubTotal(doc, cabecera);
  generarTotal(doc, cabecera); 
  generarPie(doc,tipo);

  doc.end();
  return doc;
};

module.exports = { createTicket };
