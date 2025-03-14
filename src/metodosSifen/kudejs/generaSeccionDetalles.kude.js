const fs = require('fs');
const {   titleCase } = require('./util.kude');


const generaSeccionDetalles = (doc, datosDocumento, sectionLineLeft, sectionLineRight, headerLineBottom) => { 
  const { detalles } = datosDocumento;
  const sectionGeneraTamano = 80;
  const sectionLineTop = headerLineBottom + sectionGeneraTamano + 5;
  let y = sectionLineTop + 10;
  
  // Calcular el ancho disponible
  const anchoDisponible = sectionLineRight - sectionLineLeft; // 555.28
  
  // Definir columnas dinámicamente con títulos, anchos y alineaciones ajustadas
  const columnas = [
    { titulo: "Código", ancho: 55, alineacion: "left", color: '#FFDDC1' },
    { titulo: "Descripción", ancho: 165, alineacion: "left", color: '#FFABAB' },
    { titulo: "Cantidad", ancho: 55, alineacion: "center", color: '#FFC3A0' },
    { titulo: "Precio", ancho: 55, alineacion: "center", color: '#FF00A0' },
    { titulo: "Descuento", ancho: 55, alineacion: "center", color: '#D5AAFF' },
    { titulo: "Exenta", ancho: 55, alineacion: "center", color: '#85E3FF' },
    { titulo: "5%", ancho: 55, alineacion: "center", color: '#B9FBC0' },
    { titulo: "10%", ancho: 55, alineacion: "center", color: '#FF9CEE' }
  ];
  
  // Pintar bordes de la tabla
  doc.moveTo(sectionLineLeft, sectionLineTop).lineTo(sectionLineRight, sectionLineTop).stroke("#333333");
  doc.moveTo(sectionLineLeft, sectionLineTop).lineTo(sectionLineLeft, y + detalles.length * 18 + 20).stroke("#333333");
  doc.moveTo(sectionLineRight, sectionLineTop).lineTo(sectionLineRight, y + detalles.length * 18 + 20).stroke("#333333");
  const titleSpace = sectionLineTop +5;
  // Dibujar encabezados de la tabla
  doc.font("Helvetica-Bold").fontSize(7);
  let x = sectionLineLeft + 5;
  columnas.forEach(col => {
    doc.rect(x - 2, titleSpace - 2, col.ancho, 12).fill(col.color);
    doc.fillColor("black").text(col.titulo, x, titleSpace, { width: col.ancho, align: 'center' });
    x += col.ancho;
  });  
  const titleLineBottom = sectionLineTop + 15;
  doc.moveTo(sectionLineLeft, titleLineBottom  ).lineTo(sectionLineRight, titleLineBottom  ).stroke("#333333");
  y += 20; // Espaciado solo para el encabezado

  // Dibujar filas dinámicamente
  doc.font("Helvetica").fontSize(7);
  detalles.forEach((detalle, rowIndex) => {
      const valores = [
          detalle.dCodInt[0],
          titleCase(detalle.dDesProSer[0]),
          detalle.dCantProSer[0],
          detalle.gValorItem[0].dPUniProSer[0],
          detalle.gValorItem[0].gValorRestaItem[0].dDescItem[0],
          "0", "0", "0"
      ];
      const total = detalle.gValorItem[0].gValorRestaItem[0].dTotOpeItem[0];
      const tasaIVA = detalle.gCamIVA[0].dTasaIVA[0];

      if (tasaIVA === "10") valores[7] = total;
      else if (tasaIVA === "5") valores[6] = total;
      else valores[5] = total;

      x = sectionLineLeft + 5;
      valores.forEach((valor, index) => {
          doc.fillColor("black").text(valor, x, y, { width: columnas[index].ancho, align: columnas[index].alineacion, lineGap: 2 });
          x += columnas[index].ancho;
      });
      y += 18; // Espaciado entre filas aumentado
  });

  // Línea final de la tabla
  doc.moveTo(sectionLineLeft, y).lineTo(sectionLineRight, y).stroke("#333333");
};
  module.exports = { generaSeccionDetalles };