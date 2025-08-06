
const lineaPunteada = (doc, y) => {
  doc
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .dash(1, { space: 2 })
    .stroke()
    .undash();
};
const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anho = fecha.getFullYear();
  return `${dia}/${mes}/${anho}`;
};
const generarCabecera = (doc, cabecera) => {
   doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(cabecera.empresa.razonSocial, { align: "center" })
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("RUC: " + cabecera.empresa.ruc, { align: "center" })
    .text(cabecera.sucursal.descripcion, { align: "center" })
    .text(cabecera.sucursal.direccion, { align: "center" });

  if (cabecera.sucursal.telefono)
    doc.text("Tel: " + cabecera.sucursal.telefono, { align: "center" });

  if (cabecera.sucursal.cel)
    doc.text("Cel: " + cabecera.sucursal.cel, { align: "center" });

  if (cabecera.empresa.web)
    doc.text(cabecera.empresa.web, { align: "center" });

  doc.moveDown(0.5);
  doc.text("TIMBRADO: " + cabecera.timbrado, { align: "left" });
  doc.text("FACTURA N°: " + cabecera.nroComprobante, { align: "left" }); 
doc.text("VALIDO DESDE: " + formatearFecha(cabecera.fechaInicio), { align: "left" });
doc.text("VALIDO HASTA: " + formatearFecha(cabecera.fechaFin), { align: "left" });
doc.text("FECHA EMISIÓN: " + formatearFecha(cabecera.fecha), { align: "left" });
doc.text("CONDICION DE PAGO: " +  cabecera.condicionPago?.descripcion  || '', { align: "left" });
  doc.moveDown(); 
  doc.moveDown(0.5);
};
const generarDatosCliente = (doc, cabecera) => {
  doc
    .font("Helvetica")
    .fontSize(10)
    .text("Cliente: " + cabecera.clienteSucursal.nombre)
    .text("RUC/CI: " + cabecera.cliente.nroDocumento);

  if (cabecera.cliente.telefono)
    doc.text("Tel: " + cabecera.cliente.telefono);

  if (cabecera.cliente.direccion)
    doc.text("Dirección: " + cabecera.cliente.direccion);

  doc.moveDown();
  lineaPunteada(doc, doc.y);
  doc.moveDown(0.5);
};

const generarDetalles = (doc, detalles) => {
  const nf = new Intl.NumberFormat("es-PY");

  const margenIzquierdo = doc.page.margins.left;
  const anchoTotal = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // 🔷 Cabecera de tabla
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("DESCRIPCIÓN", margenIzquierdo);

  doc
    .text("CANT x PRECIO", margenIzquierdo, doc.y, { continued: true })
    .text("TOTAL", margenIzquierdo, doc.y, {
      align: "right",
      width: anchoTotal,
    });

  doc.moveDown(0.5);
  lineaPunteada(doc, doc.y);
  doc.moveDown(0.5);

  // 🔷 Detalles
  detalles.forEach((item) => {
    const cantidad = +item.cantidad;
    const precio = nf.format(item.importePrecio);
    const total = nf.format(item.importeTotal);
    
    const desc = `${item.producto.nombre} ${item.presentacion?.descripcion || ""} ${item.variedad?.descripcion || ""}`.trim();

   // Línea 1: descripción con tamaño más chico
doc
  .font("Helvetica")
  .fontSize(8) // 👈 un punto más chico
  .text(desc, margenIzquierdo, doc.y);

   // Línea 2: cantidad x precio y total alineado (más grande)
doc
  .font("Helvetica")
  .fontSize(9) // 👈 tamaño normal o más grande
  .text(`${cantidad} x Gs ${precio}`, margenIzquierdo, doc.y, { continued: true })
  .text(`Gs ${total}`, margenIzquierdo, doc.y, {
    align: "right",
    width: anchoTotal,
  });

    doc.moveDown(0.5);
    lineaPunteada(doc, doc.y);
    doc.moveDown(0.5);
  });
};


const generarAhorro = (doc, montoDescuento) => {
  if (!montoDescuento || montoDescuento <= 0) return;
  doc.moveDown();
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("USTED AHORRÓ Gs " + new Intl.NumberFormat("es-PY").format(montoDescuento), {
      align: "center", 
    });
    doc.moveDown();
  lineaPunteada(doc, doc.y);
  doc.moveDown();
};

const generarSubTotal = (doc, cabecera) => {
  const exentas = parseFloat(+cabecera.importeIvaExenta || 0);
  const iva5 = parseFloat(+cabecera.importeIva5 || 0);
  const iva10 = parseFloat(+cabecera.importeIva10 || 0);
  const subTotal = parseFloat(+cabecera.importeSubtotal || 0);
  const importeDescuento = parseFloat(+cabecera.importeDescuento || 0);
  const nf = new Intl.NumberFormat("es-PY");
 
  
  doc.moveDown(0.5);
  doc
    .font("Helvetica-Bold")
    .fontSize(9)  
    .text(` TOTAL EXENTA        : Gs ${nf.format(exentas)}`)
    .text(` TOTAL IVA 5%          : Gs ${nf.format(iva5)}`)
    .text(` TOTAL IVA 10%        : Gs ${nf.format(iva10)}`)
    .text(` TOTAL IVA                : Gs ${nf.format(iva5 + iva10)}`)
    .text(` T.DESCUENTO         : Gs ${nf.format(importeDescuento)}`) 
    .text(` SUBTOTAL               : Gs ${nf.format(subTotal)}`)
    doc.moveDown();
  lineaPunteada(doc, doc.y);
  doc.moveDown();
};

const generarTotal = (doc, cabecera) => {
  const nf = new Intl.NumberFormat("es-PY");
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("TOTAL A PAGAR: Gs " + nf.format(cabecera.importeTotal), { align: "right" });
  lineaPunteada(doc, doc.y); 
  doc.moveDown(0.5);
   doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Los datos impresos requieren de cuidados especiales.Evitar contacto  directo con plasticos, materiales químicos, calor y humedad en exceso, luz solar" , { align: "center" });
  lineaPunteada(doc, doc.y);
  doc.moveDown();
};
 

const generarPie = (doc, copia) => {
  doc
    .font("Helvetica")
    .fontSize(9)
    .text("Gracias por su compra", { align: "center" })
    .text(copia, { align: "center" });
  doc.moveDown();
};


module.exports = {
  generarCabecera,
  generarDatosCliente,
  generarDetalles,
  generarAhorro,
  generarSubTotal,
  generarTotal,
  
  generarPie
};
