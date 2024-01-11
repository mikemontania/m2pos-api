const {NumeroALetra} = require('./convertLetter.js');

const generarCabecera = (doc) => {
  const headerTop = 30;
  const headerLeft = 30;
  const headerRight = 580;
  const headerBottom = 130;
  const anchoImagen =85;
  const encabezado = "KuDE de Factura electrónica";
  const empresa = "CAVALLARO S.A.C.e.I";
  const antividades = [
    "Fabricación de plásticos y caucho sintético en formas primarias",
    "Fabricación de jabones, detergentes y preparados de limpieza",
    "Fabricación y transformación de productos diversos por cuenta de terceros."
  ];
  const datos = [
    "Cavallaro Express - Capiatá: Ruta 1 Km. 18 - Capiatá.",
    "Cel.: 0981 627 369 : www.cavallaro.com.py", 
  ];

  const factura = [
    '16032661',
    '21/11/2022',
    '80003110-5', 
    '011-001-0017351'
  ];

  // Dibujar cuadrícula alrededor del header
  doc
    .moveTo(headerLeft, headerTop)
    .lineTo(headerRight, headerTop)
    .lineTo(headerRight, headerBottom)
    .lineTo(headerLeft, headerBottom)
    .lineTo(headerLeft, headerTop)
    .stroke("#aaaaaa");


//logo

doc
.image(
  "./src/uploads/empresas/grupocavallaro3.png",
  headerLeft + 0,
  headerTop + 0,
  { width: anchoImagen }
)
//Actividades
  doc 
    .fillColor("#444444")
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(encabezado, headerLeft + anchoImagen+5, headerTop + 10)
    .text(empresa, headerLeft + anchoImagen+5, headerTop + 20)

    .text(antividades[0], headerLeft + anchoImagen+5, headerTop + 35)
    .text(antividades[1], headerLeft + anchoImagen+5, headerTop + 45)
    .text(antividades[2], headerLeft + anchoImagen+5, headerTop + 55)

    .text(datos[0], headerLeft + anchoImagen+5, headerTop + 70)
    .text(datos[1], headerLeft + anchoImagen+5, headerTop + 80)
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
    .text("TIMBRADO N°: " + factura[0], barraVertical+5, headerTop + 10, { bold: true })
    .text("Inicio Vigencia: " + factura[1], barraVertical+5, headerTop + 25, { bold: true })
    .text("RUC: " + factura[2], barraVertical+5, headerTop + 40, { bold: true })
    .text('FACTURA ELECTRÓNICA', barraVertical+5, headerTop + 55, { bold: true })
    .text("N° " + factura[3], barraVertical+5, headerTop + 70, { bold: true })

    .moveDown();
};
const generarDatosCliente = (doc) => {
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

/*   doc
    .moveTo(barraVertical2, headerTop)
    .lineTo(barraVertical2, headerTop + 60)
    .stroke("#aaaaaa");
 */
  // Datos del cliente
  const titulo1 = [
   
    "RAZÓN SOCIAL:",
    "RUC:",
    "DIRECCIÓN:",
    "TEL.:",
  ];
  const data1 = [

    "MIGUEL ALEJANDRO MONTANIA GODOY",
    "3960657",
    "AVDA CENTRAL",
    "595983730956",
  ];

  const titulo2 = [
    "FECHA DE EMISIÓN:",
    "CONDICIÓN DE VENTA:",
    "VENDEDOR: ",
  ];
  const data2 = [
    "04.01.2024",
    "CONTADO",
    "SHOWROOM",
  ];

  doc 
  .font("Helvetica-Bold")
    .fontSize(8)
    .text(titulo1.join('\n'), headerLeft+ 10, headerTop + 10);

    doc 
    .font("Helvetica")
    .fontSize(8)
    .text(data1.join('\n'), headerLeft+ 75, headerTop + 10);

    doc 
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(titulo2.join('\n'), barraVertical1 + 10, headerTop + 10);

    doc 
    .font("Helvetica")
    .fontSize(8)
    .text(data2.join('\n'),      barraVertical1 + 120, headerTop + 10);

 
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
  const detallesLeft = 30;
  const barraVertical1 = 100;
  const barraVertical2 = 130;
  const barraVertical3 = 300;
  const barraVertical4 = 352;
  const barraVertical5 = 409;
  const barraVertical6 = 466;
  const barraVertical7 = 523;
   

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
    .text("Cód. Producto", detallesLeft + 7, detallesTop)
    .text("Cant.", barraVertical1 + 7, detallesTop)
    .fontSize(7)
    .text("Descripción", barraVertical2 + 60, detallesTop)
    .text("Precio", barraVertical3 + 10, detallesTop)
    .text("I.Descuento", barraVertical4 + 5, detallesTop)
    .text("Exenta", barraVertical5 + 5, detallesTop)
    .text("IVA 5%", barraVertical6 + 5, detallesTop)
    .text("IVA 10%", barraVertical7 + 5, detallesTop);



  // Detalles de la tabla
  detalles.forEach((detalle, index) => {
    const rowTop = detallesTop + (index + 1) * 20;
    const importeTotalColumna = (porcIva) => {
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
    doc
      .font("Helvetica")
      .fontSize(8)
      .text(detalle.producto.codProductoErp, detallesLeft + 10, rowTop, { width: 100 })
      .text(detalle.cantidad.toString(), barraVertical1 + 10, rowTop, { width: 30 })
      .text(detalle.producto.nombreProducto, barraVertical2 + 10, rowTop, { width: 170 })
      .text(new Intl.NumberFormat('es-PY').format(detalle.importePrecio.toFixed(2)), barraVertical3 + 10, rowTop, { width: 100 })
      .text(new Intl.NumberFormat('es-PY').format(detalle.importeDescuento.toFixed(2)), barraVertical4 + 7, rowTop, { width: 70 })
      .text(new Intl.NumberFormat('es-PY').format(detalle.importeTotal.toFixed(2)), importeTotalColumna(detalle.porcIva), rowTop);
  });
};

const generarAhorro = (doc, montoDescuento) => {
  const top = 600;
  const left = 30;
  const right = 580;
  const bottom = 615;
console.log(montoDescuento)
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
    .lineTo(barraVertical7,   bottom)
    .stroke("#aaaaaa"); 

    doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Usted Ahorró", left +150,  top+5)

  // Encabezados de las columnas
  doc
 
    .fontSize(8)
    .text(new Intl.NumberFormat('es-PY').format(montoDescuento.toFixed(2)), barraVertical7+5  , top+5) ;
 
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
    .lineTo(barraVertical7,   bottom)
    .stroke("#aaaaaa"); 

    doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text("TOTAL A PAGAR: "+ NumeroALetra.convertir(importeTotal,true), left +5,  top+5)
 
  // Encabezados de las columnas
    doc
 
    .fontSize(8)
    .text(new Intl.NumberFormat('es-PY').format(importeTotal.toFixed(2)), barraVertical7 +2  , top+5) ;
};
const generarIva = (doc, venta) => {
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
    .text("Liquidacion de iva: " , left +5,  top+5)


    doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text("5%: "+new Intl.NumberFormat('es-PY').format(venta.importeIva5.toFixed(2)) , left +100,  top+5)


    doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text("10%: "+new Intl.NumberFormat('es-PY').format(venta.importeIva10.toFixed(2)) , left +200,  top+5)

    doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text("Exenta: "+new Intl.NumberFormat('es-PY').format(venta.importeIvaExenta.toFixed(2)) , left +350,  top+5)

    const total =  venta.importeIva5 +venta.importeIva10 + venta.importeIvaExenta;
    doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .text("Total IVA: "+new Intl.NumberFormat('es-PY').format(total.toFixed(2)) , left +430,  top+5)
 
 
  
  
};

 


 
 

const formatCurrency = importe => {
  return new Intl.NumberFormat('es-PY').format(importe.toFixed(2)) +'Gs';
};

const formatDate = date => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
};

module.exports = {
  generarCabecera,
  generarDatosCliente,
  generarDetalles,
  generarAhorro,
  generarTotalTexto,
  generarIva, 
};
