const { NumeroALetra } = require("./convertLetter.js");
  
const generarCabecera = (doc, documento , top) => {
 
  const headerLeft = 30;
  const headerRight = 580;
  const headerBottom = top+90;
  const anchoImagen = 60;
  const topBloque = top + 10;
  const inicioBloque2 = 100; 
  const anchoBloque2 = 385;
  const barraVertical = headerLeft + anchoBloque2;
  const anchoBloque3 = headerRight-barraVertical;
  const encabezado = " ";
  const empresa = documento.empresa.razonSocial;
  const ruc = documento.empresa.ruc;
   

  const sucursal = documento.sucursal.descripcion;
  const direccion = documento.sucursal.direccion;
  const telefono = documento.sucursal?.telefono && documento.sucursal.telefono.length > 1 
  ? `Tel: ${documento.sucursal.telefono}` 
  : '';

const web = documento.empresa.web && documento.empresa.web.length > 1 
  ? `${documento.empresa.web}` 
  : '';

const cel = documento.sucursal?.cel && documento.sucursal.cel.length > 1 
  ? `Cel: ${documento.sucursal.cel}` 
  : '';
  const timbrado = documento.timbrado;
  const nroComprobante = documento.nroComprobante;

  const datos1 = `${sucursal} ${direccion} `;
  const datos2 = `${telefono} ${cel} ${web}`.trim(); 
  // Dibujar cuadrícula alrededor del header
  doc
    .moveTo(headerLeft, top)
    .lineTo(headerRight, top)
    .lineTo(headerRight, headerBottom)
    .lineTo(headerLeft, headerBottom)
    .lineTo(headerLeft, top)
    .stroke("#aaaaaa");
    doc
    .moveTo(barraVertical, top)
    .lineTo(barraVertical, headerBottom)
    .stroke("#aaaaaa");
  //logo
     const img =    documento.empresa.img && documento.empresa.img.length > 1      ? `./src/uploads/empresas/${documento.empresa.img}`      : "./src/uploads/empresas/grupocavallaro.png"; 
   doc.image(img, headerLeft+2 , top+5 , { width: anchoImagen });
   const actividad1 =capitalize(documento.empresa.actividades[0]?.descripcion);
   const actividad2 =capitalize(documento.empresa.actividades[1]?.descripcion);
   const actividad3 =capitalize(documento.empresa.actividades[2]?.descripcion);
   const actividad4 =capitalize(documento.empresa.actividades[3]?.descripcion);
   const actividad5 =capitalize(documento.empresa.actividades[4]?.descripcion);
 
 
// Bloque 2
doc.fillColor("#444444");

// Mostrar la razón social aparte, con font más grande
doc
  .font("Helvetica-Bold")
  .fontSize(8) // tamaño mayor para destacarla
  .fillColor("#000000")
  .text(empresa, inicioBloque2, topBloque, {
    width: anchoBloque2,
    align: 'left'
  });

let currentTop = topBloque + 15; // Dejamos un poco de espacio después de la razón social

// Armamos bloque2 sin encabezado ni empresa (ya fue impresa)
const bloque2 = [
  actividad1,
  actividad2,
  actividad3,
  actividad4,
  actividad5,
  datos1,
  datos2
];

// Recorremos los campos normalmente
bloque2.forEach((campo) => {
  if (campo && campo.length > 1) {
    doc
      .font("Helvetica")       // menos cargado para el resto
      .fontSize(6)             // tamaño más chico
      .fillColor("#000000")
      .text(campo, inicioBloque2, currentTop, {
        width: anchoBloque2,
        align: 'left',
        lineGap: 1
      });

    const lineCount = Math.ceil(doc.widthOfString(campo) / anchoBloque2);
    currentTop += lineCount * 10;
  }
});
// Define un array con la información de cada campo en el bloque 3
const tipo = (documento.tipoDoc == 'FT')?"FACTURA":"NOTA DE CREDITO";
const bloque3 = [
  { texto: "TIMBRADO N°: " + timbrado, top: topBloque, width: anchoBloque3, align: 'left', fontSize: 11 },
  { texto: "DESDE " + formatDate(documento.fechaInicio)+" AL "+formatDate(documento.fechaFin), top: topBloque + 15, width: anchoBloque3, align: 'left', fontSize: 10 },
  { texto: "RUC: " + ruc, top: topBloque + 30, width: anchoBloque3, align: 'left', fontSize: 12 },
  { texto: tipo, top: topBloque + 45, width: anchoBloque3, align: 'center', fontSize: 14 },
  { texto: "N° " + nroComprobante, top: topBloque + 65, width: anchoBloque3, align: 'left', fontSize: 14 }
];

// Recorre el array para generar dinámicamente el contenido
bloque3.forEach(campo => {
  doc
    .font("Helvetica-Bold")
    .fontSize(campo.fontSize)
    .text(campo.texto, barraVertical + 5, campo.top, { bold: true, width: campo.width, align: campo.align })
    .moveDown();
});

};

const generarDatosCliente = (doc, documento, top) => {
  const headerLeft = 30;
  const headerRight = 580;
  const headerBottom = top + 45; 
  const barraVertical1 = 350; 
  // Dibujar cuadrícula alrededor del header
  doc
    .moveTo(headerLeft, top)
    .lineTo(headerRight, top)
    .lineTo(headerRight, headerBottom)
    .lineTo(headerLeft, headerBottom)
    .lineTo(headerLeft, top)
    .stroke("#aaaaaa");
  // Dibujar líneas verticales que dividen los campos
  doc
    .moveTo(barraVertical1, top)
    .lineTo(barraVertical1, top +45)
    .stroke("#aaaaaa");

  // Datos del cliente 

  const titulo1 = ["RAZÓN SOCIAL:", "RUC:", "DIRECCIÓN:", "CEL/TEL.:"];
  const data1 = [
    capitalize(documento.cliente.nombre) || "",
    documento.cliente.nroDocumento || "",
    documento.cliente.direccion || "",
    (documento.cliente?.cel || "") +
      (documento.cliente?.telefono || "") 
  ];

  const titulo2 = ["FECHA DE EMISIÓN:", "CONDICIÓN DE VENTA:"];
  const data2 = [    formatDate(documento.fecha),    documento.condicionPago.descripcion   ]; 
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(titulo1.join("\n"), headerLeft + 10, top + 5);

  doc
    .font("Helvetica")
    .fontSize(8)
    .text(data1.join("\n"), headerLeft + 75, top + 5);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(titulo2.join("\n"), barraVertical1 + 10, top + 5);

  doc
    .font("Helvetica")
    .fontSize(8)
    .text(data2.join("\n"), barraVertical1 + 120, top + 5);
};

const generarDetalles = (doc, detalles, top) => {
  const headerLeft = 30;
  const headerRight = 580;
  const headerBottom = top+630;
  const altura = headerBottom; 
  const detallesTop = top+5;
  const barraVertical1 = 80;
  const barraVertical2 = 300;
  const barraVertical3 = 356;
  const barraVertical4 = 412;
  const barraVertical5 = 468;
  const barraVertical6 = 524; 
  const columnWidths = [
    barraVertical1 - headerLeft - 10, // Ancho de la primera columna
    barraVertical2 - barraVertical1 - 5, // Ancho de la segunda columna
    barraVertical3 - barraVertical2 - 60, // Ancho de la tercera columna
    barraVertical4 - barraVertical3 - 10, // Ancho de la cuarta columna
    barraVertical5 - barraVertical4 - 5, // Ancho de la quinta columna
    barraVertical6 - barraVertical5 - 5, // Ancho de la sexta columna 
  ];
  // Dibujar cuadrícula alrededor del header
  doc
    .moveTo(headerLeft, top)
    .lineTo(headerRight, top)
    .lineTo(headerRight, headerBottom)
    .lineTo(headerLeft, headerBottom)
    .lineTo(headerLeft, top)
    .stroke("#aaaaaa");

  doc
    .moveTo(headerLeft, top)
    .lineTo(headerRight, top)
    .lineTo(headerRight, detallesTop+15)
    .lineTo(headerLeft, detallesTop+15)
    .lineTo(headerLeft, top)
    .stroke("#aaaaaa");

  // Línea que separa la cabecera de los detalles


  // Dibujar líneas verticales que dividen las columnas
  doc
    .moveTo(barraVertical1, top)
    .lineTo(barraVertical1, altura)
    .stroke("#aaaaaa");

  doc
    .moveTo(barraVertical2, top)
    .lineTo(barraVertical2, altura)
    .stroke("#aaaaaa");
  doc
    .moveTo(barraVertical3, top)
    .lineTo(barraVertical3, altura)
    .stroke("#aaaaaa");

  doc
    .moveTo(barraVertical4, top)
    .lineTo(barraVertical4, altura)
    .stroke("#aaaaaa");

  doc
    .moveTo(barraVertical5, top)
    .lineTo(barraVertical5, altura)
    .stroke("#aaaaaa");

  doc
    .moveTo(barraVertical6, top)
    .lineTo(barraVertical6, altura)
    .stroke("#aaaaaa");

 

  // Encabezados de las columnas
  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("Cant", headerLeft  , detallesTop, {      width: columnWidths[0],      align: "center"    })
    .fontSize(7)
    .text("Descripción", barraVertical1  , detallesTop, {      width: 220,      align: "center"    })
    .text("Precio", barraVertical2 , detallesTop, {      width: 56,      align: "center"    })
    .text("Descuento", barraVertical3  , detallesTop, {      width: 56,      align: "center"    })    
    .text("Exenta", barraVertical4 , detallesTop, {      width: 56,      align: "center"    })
    .text("IVA 5%", barraVertical5 , detallesTop, {      width: 56,      align: "center"    })
    .text("IVA 10%", barraVertical6  , detallesTop, {      width: 56,      align: "center"    });

  // Detalles de la tabla
  detalles.forEach((detalle, index) => {
    const rowTop = detallesTop+10 + (index + 1) * 9;
    const importeTotalColumna = porcIva => {
      porcIva = parseInt(Math.round(parseFloat(porcIva))); // Convertir a número entero
      switch (porcIva) {
        case 0:
          return barraVertical4 ; // Exenta
        case 5:
          return barraVertical5 ; // IVA 5%
        case 10:
          return barraVertical6 ; // IVA 10%
        default:
          return null; // Manejar otros casos si es necesario
      }
    };

    const descripcion = `${detalle.producto.nombre} ${detalle.presentacion
      .descripcion}  ${detalle.variedad.descripcion}`;
    doc
      .font("Helvetica")
      .fontSize(5) 
      .text(capitalize(descripcion), barraVertical1 + 5, rowTop, {
        width: columnWidths[2],
        align: "center"
      });

    doc
      .font("Helvetica")
      .fontSize(6)
      .text(
        new Intl.NumberFormat("es-PY").format(detalle.cantidad),
        headerLeft + 5,
        rowTop,
        { width: columnWidths[3], align: "center" }
      )
      .text(
        new Intl.NumberFormat("es-PY").format(detalle.importePrecio),
        barraVertical2 + 5,
        rowTop,
        { width: 56, align: "center" }
      )
      .text(
        new Intl.NumberFormat("es-PY").format(detalle.importeDescuento),
        barraVertical3 + 5,
        rowTop,
        { width: 56, align: "center" }
      )
      .text(
        new Intl.NumberFormat("es-PY").format(detalle.importeTotal),
        importeTotalColumna(detalle.porcIva),
        rowTop,
        { width: 56, align: "center" }
      );
  });
};
const capitalize = str => {
  if (!str) return
  return str.replace(/\b\w/g, char => char.toUpperCase());
};
const generarAhorro = (doc, montoDescuento, top) => { 
  const left = 30;
  const right = 580;
  const bottom = top+15;
  // Dibujar cuadrícula alrededor del header
  doc
    .moveTo(left, top)
    .lineTo(right, top)
    .lineTo(right, bottom)
    .lineTo(left, bottom)
    .lineTo(left, top)
    .stroke("#aaaaaa");

  const barraVertical7 = 524;
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
const generarTotalTexto = (doc, importeTotal, top) => {
   const left = 30;
  const right = 580;
  const bottom = top+15;
  // Dibujar cuadrícula alrededor del header
  doc
    .moveTo(left, top)
    .lineTo(right, top)
    .lineTo(right, bottom)
    .lineTo(left, bottom)
    .lineTo(left, top)
    .stroke("#aaaaaa");

  const barraVertical7 = 524;
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
const generarIva = (doc, documento, top) => {
  const {importeIva5,importeIva10,importeIvaExenta} = documento;
   const left = 30;
  const right = 580;
  const bottom = top+15;
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
console.log(documento)
    console.log({importeIva5,importeIva10,importeIvaExenta})

  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(
      "5%: " + new Intl.NumberFormat("es-PY").format(documento.importeIva5),
      left + 100,
      top + 5
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(
      "10%: " + new Intl.NumberFormat("es-PY").format(documento.importeIva10),
      left + 200,
      top + 5
    );

 /*  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(
      "Exenta: " +
        new Intl.NumberFormat("es-PY").format(documento.importeIvaExenta),
      left + 350,
      top + 5
    ); */

  const total = +documento.importeIva5 + +documento.importeIva10 + +documento.importeIvaExenta;
  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(
      "Total IVA: " + new Intl.NumberFormat("es-PY").format(total),
      left + 430,
      top + 5
    );
};
const generarCopia = (doc, copia, top) => { 
   const left = 30;  
  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text(copia,
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

const dividirHoja = (doc) => {
  const size = doc.page.size;
  const mitadAltura = size[1] / 2;
console.log(mitadAltura)
  // Dibujar línea horizontal que divide la hoja
  doc
    .moveTo(0, mitadAltura)
    .lineTo(size[0], mitadAltura)
    .stroke("#aaaaaa");
};
module.exports = {
  generarCabecera,
  generarDatosCliente,
  generarDetalles,
  generarAhorro,
  generarTotalTexto,
  generarIva,
  generarCopia,
  dividirHoja
};
