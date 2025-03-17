const { titleCase, formatearConSeparadorMiles } = require('./util.kude');

// Función para pintar las cuadrículas (bordes y fondo de la tabla)
const pintaCuadricula = (doc, sectionLineLeft, sectionLineRight, sectionLineTop, columnas, sectionLineBottom) => {
  // Pintar el fondo gris para la barra de los títulos
  doc.rect(sectionLineLeft, sectionLineTop, sectionLineRight - sectionLineLeft, 15).fill('#D3D3D3'); // Fondo gris

  // Pintar los bordes de la tabla
  doc.moveTo(sectionLineLeft, sectionLineTop).lineTo(sectionLineRight, sectionLineTop).stroke("#333333");
  doc.moveTo(sectionLineLeft, sectionLineTop).lineTo(sectionLineLeft, sectionLineBottom).stroke("#333333");
  doc.moveTo(sectionLineRight, sectionLineTop).lineTo(sectionLineRight, sectionLineBottom).stroke("#333333");

  // Dibujar encabezados de la tabla
  let x = sectionLineLeft + 5;
  columnas.forEach(col => {
    doc.fillColor("black").text(col.titulo, x, sectionLineTop + 5, { width: col.ancho, align: 'center' });
    x += col.ancho;
  });

  const titleLineBottom = sectionLineTop + 15;
  doc.moveTo(sectionLineLeft, titleLineBottom).lineTo(sectionLineRight, titleLineBottom).stroke("#333333");

  // Dibujar líneas verticales desde el título hasta la parte inferior de la sección
  x = sectionLineLeft;
  columnas.forEach(col => {
    doc.moveTo(x, sectionLineTop).lineTo(x, sectionLineBottom).stroke("#333333"); // Línea vertical completa
    x += col.ancho;
  });

  // Línea final de la tabla
  doc.moveTo(sectionLineLeft, sectionLineBottom).lineTo(sectionLineRight, sectionLineBottom).stroke("#333333");
};

// Función para pintar los valores de la tabla
const pintaValores = (doc, detalles, y, sectionLineLeft, columnas) => {
  doc.font("Helvetica").fontSize(7);

  detalles.forEach((detalle) => {
    const valores = [
      detalle.dCodInt[0],
      titleCase(detalle.dDesProSer[0]), // Descripción
      formatearConSeparadorMiles(detalle.dCantProSer[0]),
      formatearConSeparadorMiles(detalle.gValorItem[0].dPUniProSer[0]),
      formatearConSeparadorMiles(detalle.gValorItem[0].gValorRestaItem[0].dDescItem[0]),
      "0", "0", "0"
    ];
    const total = formatearConSeparadorMiles(detalle.gValorItem[0].gValorRestaItem[0].dTotOpeItem[0]);
    const tasaIVA = detalle.gCamIVA[0].dTasaIVA[0];

    if (tasaIVA === "10") valores[7] = total;
    else if (tasaIVA === "5") valores[6] = total;
    else valores[5] = total;

    let x = sectionLineLeft;
    const margenIzquierdo = 5;
    const margenDerecho = 5;

    // Escribir los valores en las celdas
    valores.forEach((valor, index) => {
      const alineacion = index === 1 ? "left" : "right"; // Descripción alineada a la izquierda, valores a la derecha
      const margen = index === 1 ? margenIzquierdo : margenDerecho;

      doc.fillColor("black").text(valor, x + margen, y + 3, { 
        width: columnas[index].ancho - margen * 2, 
        align: alineacion, 
        lineGap: 2 
      });

      x += columnas[index].ancho;
    });

    // Línea final de la fila
   /*  doc.moveTo(sectionLineLeft, y + 18).lineTo(x, y + 18).stroke("#333333"); */

    y += 22; // Espaciado entre filas
  });
 
};

// Genera la sección de detalles con cuadrícula
const generaSeccionDetalles = (doc, detalles, sectionLineLeft, sectionLineRight, sectionLineTop, sectionLineBottom) => { 
  return new Promise(async (resolve, reject) => {
    try { 

 
 
      let y = sectionLineTop + 10;
    
      // Definir columnas con títulos y anchos
      const columnas = [
        { titulo: "Código", ancho: 55 },
        { titulo: "Descripción", ancho: 200 },
        { titulo: "Cant.", ancho: 35 },
        { titulo: "Precio", ancho: 50 },
        { titulo: "Descuento", ancho: 50 },
        { titulo: "Exenta", ancho: 55 },
        { titulo: "5%", ancho: 55 },
        { titulo: "10%", ancho: 55 }
      ];
    
      // Pintar cuadrícula con líneas verticales completas
      pintaCuadricula(doc, sectionLineLeft, sectionLineRight, sectionLineTop, columnas, sectionLineBottom);
    
      // Espaciado para el encabezado
      y += 5;
    
      // Pintar los valores en la tabla
       pintaValores(doc, detalles, y, sectionLineLeft, columnas);
    resolve( sectionLineBottom); // Se resuelve cuando todo ha terminado
  } catch (error) {
    console.error(error);
    reject(error);
  }

  });
 
};


 

module.exports = { generaSeccionDetalles };
