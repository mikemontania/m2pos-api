const generarCabecera = (doc, cabecera) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(cabecera.empresa.razonSocial, { align: "center" })
    .font("Helvetica")
    .fontSize(8)
    .text("RUC: " + cabecera.empresa.ruc, { align: "center" })
    .text(cabecera.sucursal.descripcion, { align: "center" })
    .text(cabecera.sucursal.direccion, { align: "center" });

  if (cabecera.sucursal.telefono)
    doc.text("Tel: " + cabecera.sucursal.telefono, { align: "center" });

  if (cabecera.sucursal.cel)
    doc.text("Cel: " + cabecera.sucursal.cel, { align: "center" });

  if (cabecera.empresa.web)
    doc.text(cabecera.empresa.web, { align: "center" });

  doc
    .moveDown(0.5)
    .text("TIMBRADO: " + cabecera.timbrado, { align: "center" })
    .text("FACTURA N°: " + cabecera.nroComprobante, { align: "center" })
    .text("Fecha: " + cabecera.fecha, { align: "center" })
    .moveDown();
};

const generarDatosCliente = (doc, cabecera) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("Cliente: " + cabecera.cliente.nombre)
    .text("RUC/CI: " + cabecera.cliente.nroDocumento);

  if (cabecera.cliente.telefono)
    doc.text("Tel: " + cabecera.cliente.telefono);

  if (cabecera.cliente.direccion)
    doc.text("Dirección: " + cabecera.cliente.direccion);

  doc.moveDown();
};

const generarDetalles = (doc, detalles) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text("CODIGO   CANT.  PRECIO     TOTAL", { align: "left" })
    .text("DESCRIPCIÓN DEL ARTÍCULO")
    .text("--------------------------------------------------");

  const nf = new Intl.NumberFormat("es-PY");

  detalles.forEach((item) => {
    const cod = item.variante.id.toString().padStart(7, '0');
    const desc = `${item.producto.nombre} ${item.presentacion.descripcion || ""} ${item.variedad.descripcion || ""}`.trim();
    const cantidad = +item.cantidad;
    const precioUnit = +item.importePrecio;
    const total = +item.importeTotal;

    const lineaNumerica = `${cod}   ${cantidad.toFixed(3)}   G ${nf.format(precioUnit)}   G ${nf.format(total)}`;
    doc
      .font("Helvetica")
      .fontSize(7)
      .text(lineaNumerica)
      .text(desc)
      .moveDown(0.5);
  });
};

const generarAhorro = (doc, montoDescuento) => {
  if (!montoDescuento || montoDescuento <= 0) return;
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("USTED AHORRÓ G " + new Intl.NumberFormat("es-PY").format(montoDescuento), {
      align: "center",
      underline: true,
    })
    .moveDown();
};

const generarSubTotal = (doc, cabecera) => {
  const exentas = parseFloat(cabecera.importeIvaExenta || 0);
  const iva5 = parseFloat(cabecera.importeIva5 || 0);
  const iva10 = parseFloat(cabecera.importeIva10 || 0);

  const gravado5 = parseFloat(cabecera.totalGravado5 || 0);
  const gravado10 = parseFloat(cabecera.totalGravado10 || 0);
 const subTotal = parseFloat(cabecera.importeSubTotal || 0);
  const importeDescuento = parseFloat(cabecera.importeDescuento || 0); 
  const nf = new Intl.NumberFormat("es-PY");

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("SUB TOTALES LIQUIDACION IVA")
    .font("Helvetica")
    .fontSize(7)
    .text(`Exentas        : G ${nf.format(exentas)}`)
    .text(`Gravado 5%     : G ${nf.format(gravado5)}   IVA: G ${nf.format(iva5)}`)
    .text(`Gravado 10%    : G ${nf.format(gravado10)}   IVA: G ${nf.format(iva10)}`)
    .text(`TOTAL IVA      : G ${nf.format(iva5 + iva10)}`)
     .text(`SUBTOTAL      : G ${nf.format(subTotal)}`)
      .text(`T.Descuento      : G ${nf.format(importeDescuento)}`) 
    .moveDown();
};

const generarTotal = (doc, cabecera) => {
  const nf = new Intl.NumberFormat("es-PY");

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("TOTAL A PAGAR: G " + nf.format(cabecera.importeTotal), { align: "right" })
    /*.moveDown(0.5)
    .font("Helvetica-Bold")
    .fontSize(8)
     .text("DETALLE DE PAGOS")
    .font("Helvetica")
    .text("QR BANCARD     G " + nf.format(cabecera.importeTotal))
    .text("TOTAL PAGOS    G " + nf.format(cabecera.importeTotal)) */
    .moveDown();
};

const generarPagos = (doc, cabecera) => {
  const nf = new Intl.NumberFormat("es-PY");

/*   doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("DETALLE DE COBRO")
    .font("Helvetica")
    .text("ABONADO        : G " + nf.format(cabecera.montoAbonado || 0))
    .text("VUELTO         : G " + nf.format(cabecera.montoVuelto || 0))
    .text("EFECTIVO       : G " + nf.format(cabecera.montoEfectivo || 0))
    .moveDown(); */
};

const generarPuntos = (doc, cabecera) => {
 /*  doc
    .font("Helvetica")
    .fontSize(7)
    .text("PUNTOS OBTENIDOS: " + (cabecera.puntosObtenidos || 0))
    .text("PUNTOS ACUMULADOS: " + (cabecera.puntosAcumulados || 0))
    .moveDown(); */
};

const generarPie = (doc, copia) => {
  doc
    .font("Helvetica")
    .fontSize(7)
    .text("Gracias por su compra", { align: "center" })
    .text(copia, { align: "center" })
    .moveDown();
};

module.exports = {
  generarCabecera,
  generarDatosCliente,
  generarDetalles,
  generarAhorro,
  generarSubTotal,
  generarTotal,
  generarPagos,
  generarPuntos,
  generarPie
};
