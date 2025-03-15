const fs = require("fs");
const PDFDocument = require("pdfkit");
const { generarCabecera } = require("./generaSeccionCabecera.kude");
const { formatDate, titleCase, separarXmlData } = require("./util.kude");
const { generarSeccionGeneral } = require("./generaSeccionGenerales.kude");
const { generaSeccionDetalles } = require("./generaSeccionDetalles.kude");
const { generaSeccionSubTotal } = require("./generaSeccionSubTotal.kude");


const createKude = async (xmldata, xmlFirmado, img) => {
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
  console.log(xmlFirmado);
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
const altoDetalle =500;
const altoSubTotal =80;
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

  generarCabecera(doc,datosDocumento, img,headerLineLeft,headerLineRight,headerLineTop,headerLineBottom);
  generarSeccionGeneral(doc,datosDocumento ,headerLineLeft,headerLineRight, generalLineTop,generalLineBottom);
  generaSeccionDetalles(doc,datosDocumento ,headerLineLeft,headerLineRight,detalleLineTop,detalleLineBottom);
  generaSeccionSubTotal(doc,datosDocumento ,headerLineLeft,headerLineRight,subTotalLineTop,subTotalLineBottom);

  /*   generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc); */

  doc.end(); 
  return doc;
};
 

 
const generateHeader = (doc, datosDocumento, img) => {
  const { emisor, timbrado } = datosDocumento;
  const logoPath = `./src/uploads/empresas/${img}`;

  // Margen específico para el encabezado
  const headerMargin = 40;
  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - 2 * headerMargin;

  if (fs.existsSync(logoPath)) {
    // Logo en la parte superior izquierda
    doc.image(logoPath, headerMargin, 45, { width: 50 });
  }

  // Datos de la empresa en el centro
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(emisor.dNomFanEmi[0], headerMargin + contentWidth / 3, 50, { align: "left" })
    .font("Helvetica")
    .fontSize(10)
    .text(emisor.dDirEmi[0], headerMargin + contentWidth / 3, 65, { align: "left" })
    .text(`${emisor.dDesCiuEmi[0]}, ${emisor.dDesDepEmi[0]}`, headerMargin + contentWidth / 3, 80, { align: "left" })
    .text(`Tel: ${emisor.dTelEmi[0]}`, headerMargin + contentWidth / 3, 95, { align: "left" })
    .text(`Email: ${emisor.dEmailE[0]}`, headerMargin + contentWidth / 3, 110, { align: "left" });

  // Datos de timbrado a la derecha
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Datos de Timbrado", pageWidth - headerMargin - 200, 50, { align: "right" })
    .font("Helvetica")
    .text(`Timbrado: ${timbrado.dNumTim[0]}`, pageWidth - headerMargin - 200, 65, { align: "right" })
    .text(`Inicio Vigencia: ${timbrado.dFeIniT[0]}`, pageWidth - headerMargin - 200, 80, { align: "right" })
    .text(`Factura N°: ${timbrado.dEst[0]}-${timbrado.dPunExp[0]}-${timbrado.dNumDoc[0]}`, pageWidth - headerMargin - 200, 95, { align: "right" })
    .text(timbrado.dDesTiDE[0], pageWidth - headerMargin - 200, 110, { align: "right" });

  doc.moveDown();
};


const generateCustomerInformation = (doc, invoice) => {
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(invoice.subtotal - invoice.paid),
      150,
      customerInformationTop + 30
    )
    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.address, 300, customerInformationTop + 15)
    .text(
      invoice.shipping.city +
        ", " +
        invoice.shipping.state +
        ", " +
        invoice.shipping.country,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
};

const generateInvoiceTable = (doc, invoice) => {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(invoice.paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subtotal - invoice.paid)
  );
  doc.font("Helvetica");
};

const generateFooter = doc => {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
};

const generateTableRow = (
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) => {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
};

const generateHr = (doc, y) => {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
};

const formatCurrency = cents => {
  return "$" + (cents / 100).toFixed(2);
};



module.exports = {
  createKude
};
