const { NumeroALetra } = require("./convertLetter.js");
const path = require("path");

const styles = {
  header: {
    fontSize: 8,
    font: "Helvetica-Bold",
    color: "#444444"
  },
  bold: {
    fontSize: 11,
    font: "Helvetica-Bold"
  },
  normal: {
    fontSize: 8,
    font: "Helvetica"
  },
  small: {
    fontSize: 7,
    font: "Helvetica-Bold"
  }
};



const generarCabecera = (doc, venta) => {
  const headerTop = 30;
  const headerLeft = 30;
  const headerRight = 580;
  const headerBottom = 130;
  const anchoImagen = 85;
  const encabezado = "KuDE de Factura electrónica";
  const empresa = venta.empresa.razonSocial;
  const ruc = venta.empresa.ruc;
  
  


  const web =
    venta.empresa.web && venta.empresa.web.length > 1
      ? `${venta.empresa.web}`
      : null;
  const sucursal = venta.sucursal.descripcion;
  const direccion = venta.sucursal.direccion;
  const telefono =
    venta.sucursal.telefono && venta.sucursal.telefono.length > 1
      ? `Tel: ${venta.sucursal.telefono}`
      : null;
  const cel =
    venta.sucursal.cel && venta.sucursal.cel.length > 1
      ? `Cel: ${venta.sucursal.cel}`
      : null;
  const timbrado = venta.timbrado;
  const fechaInicio = formatDate(venta.fechaInicio);
  const nroComprobante = venta.nroComprobante;

  const datos1 = `${sucursal} ${direccion} `;
  const datos2 = `${telefono} ${cel} ${web}`;
  // Dibujar cuadrícula alrededor del header
  doc
    .moveTo(headerLeft, headerTop)
    .lineTo(headerRight, headerTop)
    .lineTo(headerRight, headerBottom)
    .lineTo(headerLeft, headerBottom)
    .lineTo(headerLeft, headerTop)
    .stroke("#aaaaaa");

  //logo
const img =
    venta.empresa.img && venta.empresa.img.length > 1
      ? `./src/uploads/empresas/${venta.empresa.img}`
      : "./src/uploads/empresas/grupocavallaro.png"; 
  doc.image(img, headerLeft + 0, headerTop + 0, { width: anchoImagen });

 
  //Actividades
  doc
    .fillColor("#444444")
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(encabezado, headerLeft + anchoImagen + 5, headerTop + 10)
    .text(empresa, headerLeft + anchoImagen + 5, headerTop + 20);

  const actividades = [
    venta.empresa.actividad1,
    venta.empresa.actividad2,
    venta.empresa.actividad3,
    datos1,
    datos2
  ];
  actividades.forEach((actividad, index) => {
    if (actividad && actividad.length > 1) {
      doc.text(
        actividad,
        headerLeft + anchoImagen + 5,
        headerTop + 35 + index * 10
      );
    }
  });

  // Dibujar barra vertical que divide las actividades y la factura
  const barraVertical = headerLeft + 385;
  doc
    .moveTo(barraVertical, headerTop)
    .lineTo(barraVertical, headerBottom)
    .stroke("#aaaaaa");
  //Factura negritas
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("TIMBRADO N°: " + timbrado, barraVertical + 5, headerTop + 10, {
      bold: true
    })
    .text(
      "Inicio Vigencia: " + fechaInicio,
      barraVertical + 5,
      headerTop + 25,
      { bold: true }
    )
    .text("RUC: " + ruc, barraVertical + 5, headerTop + 40, { bold: true })
    .text("FACTURA ELECTRÓNICA", barraVertical + 5, headerTop + 55, {
      bold: true
    })
    .moveDown();

  doc
    .moveTo(barraVertical, headerTop)
    .lineTo(barraVertical, headerBottom)
    .stroke("#aaaaaa");
  //Factura negritas
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .text("N° " + nroComprobante, barraVertical + 5, headerTop + 70, {
      bold: true
    })
    .moveDown();
};

const generarDatosCliente = (doc, venta) => {
  const headerTop = 130;
  const headerLeft = 30;
  const headerRight = 580;
  const headerBottom = 180;

  const barraVertical1 = 330;
  //const barraVertical2 = 400;
  // Dibujar cuadrícula alrededor del header
  doc
    .moveTo(headerLeft, headerTop)
    .lineTo(headerRight, headerTop)
    .lineTo(headerRight, headerBottom)
    .lineTo(headerLeft, headerBottom)
    .lineTo(headerLeft, headerTop)
    .stroke("#aaaaaa");
  // Dibujar líneas verticales que dividen los campos
  doc
    .moveTo(barraVertical1, headerTop)
    .lineTo(barraVertical1, headerTop + 50)
    .stroke("#aaaaaa");

  // Datos del cliente
  const titulo1 = ["RAZÓN SOCIAL:", "RUC:", "DIRECCIÓN:", "CEL/TEL.:"];
  const data1 = [
    venta.cliente.razonSocial || "",
    venta.cliente.nroDocumento || "",
    venta.cliente.direccion || "",
    (venta.cliente.cel || "") +
      (venta.cliente.telefono ? ` ${venta.cliente.telefono}` : "") || ""
  ];

  const titulo2 = ["FECHA DE EMISIÓN:", "CONDICIÓN DE VENTA:", "VENDEDOR: "];
  const data2 = [
    formatDate(venta.fechaVenta),
    venta.formaVenta.descripcion,
    venta.vendedorCreacion.usuario
  ];

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(titulo1.join("\n"), headerLeft + 10, headerTop + 10);

  doc
    .font("Helvetica")
    .fontSize(8)
    .text(data1.join("\n"), headerLeft + 75, headerTop + 10);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(titulo2.join("\n"), barraVertical1 + 10, headerTop + 10);

  doc
    .font("Helvetica")
    .fontSize(8)
    .text(data2.join("\n"), barraVertical1 + 120, headerTop + 10);
};

const generarDetalles = (doc, detalles) => {
  const headerTop = 180;
  const headerLeft = 30;
  const headerRight = 580;
  const headerBottom = 600;
  const altura = 600;

  // Dibujar cuadrícula alrededor del header
  doc
    .moveTo(headerLeft, headerTop)
    .lineTo(headerRight, headerTop)
    .lineTo(headerRight, headerBottom)
    .lineTo(headerLeft, headerBottom)
    .lineTo(headerLeft, headerTop)
    .stroke("#aaaaaa");

  doc
    .moveTo(headerLeft, headerTop)
    .lineTo(headerRight, headerTop)
    .lineTo(headerRight, 205)
    .lineTo(headerLeft, 205)
    .lineTo(headerLeft, headerTop)
    .stroke("#aaaaaa");

  // Línea que separa la cabecera de los detalles

  const detallesTop = 190;
  const barraVertical1 = 80;
  const barraVertical2 = 120;
  const barraVertical3 = 300;
  const barraVertical4 = 352;
  const barraVertical5 = 409;
  const barraVertical6 = 466;
  const barraVertical7 = 523;
  const columnWidths = [
    barraVertical1 - headerLeft - 10, // Ancho de la primera columna
    barraVertical2 - barraVertical1 - 5, // Ancho de la segunda columna
    barraVertical3 - barraVertical2 - 60, // Ancho de la tercera columna
    barraVertical4 - barraVertical3 - 10, // Ancho de la cuarta columna
    barraVertical5 - barraVertical4 - 5, // Ancho de la quinta columna
    barraVertical6 - barraVertical5 - 5, // Ancho de la sexta columna
    barraVertical7 - barraVertical6 - 5 // Ancho de la séptima columna
  ];

  // Dibujar líneas verticales que dividen las columnas
  doc
    .moveTo(barraVertical1, headerTop)
    .lineTo(barraVertical1, altura)
    .stroke("#aaaaaa");

  doc
    .moveTo(barraVertical2, headerTop)
    .lineTo(barraVertical2, altura)
    .stroke("#aaaaaa");
  doc
    .moveTo(barraVertical3, headerTop)
    .lineTo(barraVertical3, altura)
    .stroke("#aaaaaa");

  doc
    .moveTo(barraVertical4, headerTop)
    .lineTo(barraVertical4, altura)
    .stroke("#aaaaaa");

  doc
    .moveTo(barraVertical5, headerTop)
    .lineTo(barraVertical5, altura)
    .stroke("#aaaaaa");

  doc
    .moveTo(barraVertical6, headerTop)
    .lineTo(barraVertical6, altura)
    .stroke("#aaaaaa");

  doc
    .moveTo(barraVertical7, headerTop)
    .lineTo(barraVertical7, altura)
    .stroke("#aaaaaa");

  // Encabezados de las columnas
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("Codigo", headerLeft + 10, detallesTop, {
      width: columnWidths[0],
      align: "center"
    })
    .text("Cant.", barraVertical1 + 5, detallesTop, {
      width: columnWidths[1],
      align: "center"
    })
    .fontSize(7)
    .text("Descripción", barraVertical2 + 30, detallesTop, {
      width: columnWidths[2],
      align: "center"
    })
    .text("Precio", barraVertical3 + 10, detallesTop, {
      width: columnWidths[3],
      align: "center"
    })
    .text("Descuento", barraVertical4 + 5, detallesTop, {
      width: columnWidths[4],
      align: "center"
    })
    .text("Exenta", barraVertical5 + 5, detallesTop, {
      width: columnWidths[5],
      align: "center"
    })
    .text("IVA 5%", barraVertical6 + 5, detallesTop, {
      width: columnWidths[6],
      align: "center"
    })
    .text("IVA 10%", barraVertical7 + 5, detallesTop, {
      width: columnWidths[7],
      align: "center"
    });

  // Detalles de la tabla
  detalles.forEach((detalle, index) => {
    const rowTop = detallesTop + (index + 1) * 20;
    const importeTotalColumna = porcIva => {
      porcIva = parseInt(Math.round(parseFloat(porcIva))); // Convertir a número entero
      switch (porcIva) {
        case 0:
          return barraVertical5 + 7; // Exenta
        case 5:
          return barraVertical6 + 7; // IVA 5%
        case 10:
          return barraVertical7 + 7; // IVA 10%
        default:
          return null; // Manejar otros casos si es necesario
      }
    };

    const descripcion = `${detalle.producto.nombre} ${detalle.presentacion
      .descripcion}  ${detalle.variedad.descripcion}`;
    doc
      .font("Helvetica")
      .fontSize(5)
      .text(detalle.variante.codErp, headerLeft + 10, rowTop, {
        width: columnWidths[0],
        align: "center"
      })
      .text(capitalize(descripcion), barraVertical2 + 5, rowTop, {
        width: columnWidths[2],
        align: "center"
      });

    doc
      .font("Helvetica")
      .fontSize(6)
      .text(
        new Intl.NumberFormat("es-PY").format(detalle.cantidad),
        barraVertical1 + 5,
        rowTop,
        { width: columnWidths[3], align: "center" }
      )
      .text(
        new Intl.NumberFormat("es-PY").format(detalle.importePrecio),
        barraVertical3 + 5,
        rowTop,
        { width: columnWidths[4], align: "center" }
      )
      .text(
        new Intl.NumberFormat("es-PY").format(detalle.importeDescuento),
        barraVertical4 + 5,
        rowTop,
        { width: columnWidths[5], align: "center" }
      )
      .text(
        new Intl.NumberFormat("es-PY").format(detalle.importeTotal),
        importeTotalColumna(detalle.variante.porcIva),
        rowTop,
        { width: columnWidths[6], align: "center" }
      );
  });
};
const capitalize = str => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};
const generarAhorro = (doc, montoDescuento) => {
  const top = 600;
  const left = 30;
  const right = 580;
  const bottom = 615;
  // Dibujar cuadrícula alrededor del header
  doc
    .moveTo(left, top)
    .lineTo(right, top)
    .lineTo(right, bottom)
    .lineTo(left, bottom)
    .lineTo(left, top)
    .stroke("#aaaaaa");

  const barraVertical7 = 523;
  // Dibujar líneas verticales que dividen las columnas
  doc
    .moveTo(barraVertical7, top)
    .lineTo(barraVertical7, bottom)
    .stroke("#aaaaaa");

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Usted Ahorró", left + 150, top + 5);

  // Encabezados de las columnas
  doc
    .fontSize(8)
    .text(
      new Intl.NumberFormat("es-PY").format(montoDescuento),
      barraVertical7 + 5,
      top + 5,
      { width: 52, align: "center" }
    );
};
const generarTotalTexto = (doc, importeTotal) => {
  const top = 615;
  const left = 30;
  const right = 580;
  const bottom = 630;
  // Dibujar cuadrícula alrededor del header
  doc
    .moveTo(left, top)
    .lineTo(right, top)
    .lineTo(right, bottom)
    .lineTo(left, bottom)
    .lineTo(left, top)
    .stroke("#aaaaaa");

  const barraVertical7 = 523;
  // Dibujar líneas verticales que dividen las columnas
  doc
    .moveTo(barraVertical7, top)
    .lineTo(barraVertical7, bottom)
    .stroke("#aaaaaa");

  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(
      "TOTAL A PAGAR: " + NumeroALetra.convertir(importeTotal, true),
      left + 5,
      top + 5
    );

  // Encabezados de las columnas
  doc
    .fontSize(8)
    .text(
      new Intl.NumberFormat("es-PY").format(importeTotal),
      barraVertical7 + 2,
      top + 5,
      { width: 52, align: "center" }
    );
};
const generarIva = (doc, venta) => {
  const {importeIva5,importeIva10,importeIvaExenta} = venta;
  const top = 630;
  const left = 30;
  const right = 580;
  const bottom = 645;
  // Dibujar cuadrícula alrededor del header
  doc
    .moveTo(left, top)
    .lineTo(right, top)
    .lineTo(right, bottom)
    .lineTo(left, bottom)
    .lineTo(left, top)
    .stroke("#aaaaaa");
    doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text("Liquidacion de iva: ", left + 5, top + 5);
console.log(venta)
    console.log({importeIva5,importeIva10,importeIvaExenta})

  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(
      "5%: " + new Intl.NumberFormat("es-PY").format(venta.importeIva5),
      left + 100,
      top + 5
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(
      "10%: " + new Intl.NumberFormat("es-PY").format(venta.importeIva10),
      left + 200,
      top + 5
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(
      "Exenta: " +
        new Intl.NumberFormat("es-PY").format(venta.importeIvaExenta),
      left + 350,
      top + 5
    );

  const total = +venta.importeIva5 + +venta.importeIva10 + +venta.importeIvaExenta;
  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(
      "Total IVA: " + new Intl.NumberFormat("es-PY").format(total),
      left + 430,
      top + 5
    );
};

const formatCurrency = importe => {
  return new Intl.NumberFormat("es-PY").format(importe) + "Gs";
};

const formatDate = date => {
  if (date) {
    const data = date.toString().split("-");
    return `${data[2]}/${data[1]}/${data[0]}`;
  }
  return "";
};
module.exports = {
  generarCabecera,
  generarDatosCliente,
  generarDetalles,
  generarAhorro,
  generarTotalTexto,
  generarIva
};
