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

  // Línea final de la tabla
  doc.moveTo(sectionLineLeft, sectionLineBottom).lineTo(sectionLineRight, sectionLineBottom).stroke("#333333");
};

// Función para pintar los valores de la tabla
const pintaValores = (doc, detalles, y, sectionLineLeft, columnas) => {
  doc.font("Helvetica").fontSize(7);

  // Colores distintos para cada columna (ajústalos si es necesario)
  const coloresColumnas = ["#FFDDC1", "#D4E157", "#AED581", "#4FC3F7", "#9575CD", "#FF8A65", "#81C784", "#FFB74D"];

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

    // 🔹 Dibujar primero los fondos de color
    columnas.forEach((col, index) => {
      doc.rect(x, y, col.ancho, 18).fill(coloresColumnas[index]); // Ajuste de altura para evitar solapamiento
      x += col.ancho;
    });

    x = sectionLineLeft; // Reiniciar posición para el texto
    const margenIzquierdo = 5;
    const margenDerecho = 5;

    // 🔹 Escribir el texto
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

    // 🔹 Dibujar las líneas verticales después de los colores y el texto
    x = sectionLineLeft;
    columnas.forEach((col) => {
      doc.moveTo(x, y).lineTo(x, y + 18).stroke("#333333"); // Línea vertical alineada con cada columna
      x += col.ancho;
    });

    // Línea final de la fila
    doc.moveTo(sectionLineLeft, y + 18).lineTo(x, y + 18).stroke("#333333");

    y += 18; // Espaciado entre filas aumentado
  });

  return y;
};


const generaSeccionDetalles = (doc, datosDocumento, sectionLineLeft, sectionLineRight, sectionLineTop,sectionLineBottom) => { 
  const { detalles } = datosDocumento;
 
  let y = sectionLineTop + 10;
   //A4 (595.28 x 841.89)
  // Definir columnas dinámicamente con títulos, anchos y alineaciones ajustadas
  const columnas = [
    { titulo: "Código", ancho: 55, alineacion: "left", color: '#D3D3D3' },
    { titulo: "Descripción", ancho: 170, alineacion: "left", color: '#D3D3D3' },
    { titulo: "Cantidad", ancho: 55, alineacion: "center", color: '#D3D3D3' },
    { titulo: "Precio", ancho: 55, alineacion: "center", color: '#D3D3D3' },
    { titulo: "Descuento", ancho: 55, alineacion: "center", color: '#D3D3D3' },
    { titulo: "Exenta", ancho: 55, alineacion: "center", color: '#D3D3D3' },
    { titulo: "5%", ancho: 55, alineacion: "center", color: '#D3D3D3' },
    { titulo: "10%", ancho: 55, alineacion: "center", color: '#D3D3D3' }
  ];

  // Pintar cuadrícula
  pintaCuadricula(doc, sectionLineLeft, sectionLineRight, sectionLineTop,  columnas,  sectionLineBottom );

  // Espaciado solo para el encabezado
  y += 20;

  // Pintar los valores de la tabla
  y = pintaValores(doc, detalles, y, sectionLineLeft, columnas);


};

module.exports = { generaSeccionDetalles };
