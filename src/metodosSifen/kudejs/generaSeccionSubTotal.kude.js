const { formatearConSeparadorMiles } = require('./util.kude');

const generaSeccionSubTotal = (doc, datosDocumento, sectionLineLeft, sectionLineRight, sectionLineTotalTop, sectionLineTotalBottom) => { 
  return new Promise(async (resolve, reject) => {
    try{    
      const { totales } = datosDocumento;
      dibujarCuadricula(doc, sectionLineLeft, sectionLineRight, sectionLineTotalBottom, sectionLineTotalTop);
    
      const margenDerecho = 2; // Margen adicional para los valores
    
      const columnasSubtotales = [
        { titulo: "Exentas", valor: formatearConSeparadorMiles(totales.dSubExe[0]), ancho: 60 },
        { titulo: "5%", valor: formatearConSeparadorMiles(totales.dSub5[0]), ancho: 60 },
        { titulo: "10%", valor: formatearConSeparadorMiles(totales.dSub10[0]), ancho: 60 },
      ];
    
      const columnasIVA = [
        { titulo: "(5%)", valor: "(5%): "+formatearConSeparadorMiles(totales.dIVA5[0]), ancho: 150 },
        { titulo: "(10%)", valor: "(10%): "+formatearConSeparadorMiles(totales.dIVA10[0]), ancho: 150 },
        { titulo: "TOTAL IVA", valor: "TOTAL IVA: "+formatearConSeparadorMiles(totales.dTotIVA[0]), ancho: 150 },
      ];
    
      let y = sectionLineTotalTop + 5;
    
      // SUBTOTAL  
      doc.font("Helvetica-Bold").fontSize(8).text("SUBTOTAL:", sectionLineLeft + 5, y);
      
      let x = sectionLineRight - columnasSubtotales.reduce((sum, col) => sum + col.ancho, 0) - margenDerecho;
    
      columnasSubtotales.forEach(col => {
        doc.font("Helvetica").text(col.valor, x, y, { width: col.ancho, align: "right" });
        x += col.ancho;
      });
    
      // Línea separadora
      y += 15;
      doc.moveTo(sectionLineLeft, y).lineTo(sectionLineRight, y).stroke("#333333");
    
      // TOTAL DE LA OPERACIÓN  
      y += 5;
      doc.font("Helvetica-Bold").text("TOTAL DE LA OPERACIÓN:", sectionLineLeft + 5, y);
      doc.font("Helvetica").text(formatearConSeparadorMiles(totales.dTotOpe[0]), sectionLineRight - 60 - margenDerecho, y, { width: 60, align: "right" });
    
      // Línea separadora
      y += 15;
      doc.moveTo(sectionLineLeft, y).lineTo(sectionLineRight, y).stroke("#333333");
    
      // TOTAL EN GUARANÍES  
      y += 5;
      doc.font("Helvetica-Bold").text("TOTAL EN GUARANÍES:", sectionLineLeft + 5, y);
      doc.font("Helvetica").text(formatearConSeparadorMiles(totales.dTotGralOpe[0]), sectionLineRight - 60 - margenDerecho, y, { width: 60, align: "right" });
    
      // Línea separadora
      y += 15;
      doc.moveTo(sectionLineLeft, y).lineTo(sectionLineRight, y).stroke("#333333");
    
      // LIQUIDACIÓN IVA  
      y += 5;
      doc.font("Helvetica-Bold").text("LIQUIDACIÓN IVA:", sectionLineLeft + 5, y);
      x = 100;
    
      columnasIVA.forEach(col => {
        doc.font("Helvetica").text(col.valor, x - margenDerecho, y, { width: col.ancho, align: "right" });
        x += col.ancho;
      });
    
      // Línea final
      y += 15;
      doc.moveTo(sectionLineLeft, y).lineTo(sectionLineRight, y).stroke("#333333");
      resolve( ); // Se resuelve cuando todo ha terminado
  } catch (error) {
    console.error(error);
    reject(error);
  }
});
};
  
 
 


const dibujarCuadricula = (doc, sectionLineLeft, sectionLineRight, sectionLineTotalBottom, sectionLineTotalTop) => {
  // Pintar fondo gris
  doc.fillColor("#E0E0E0") // Color gris claro
    .rect(sectionLineLeft, sectionLineTotalTop, sectionLineRight - sectionLineLeft, sectionLineTotalBottom - sectionLineTotalTop)
    .fill();

  // Restaurar color del texto
  doc.fillColor("#000000"); // Establecer color negro para que los valores sean visibles

  // Dibujar bordes de la cuadrícula
  doc.lineWidth(1).strokeColor("#333333")
    .moveTo(sectionLineLeft, sectionLineTotalTop)
    .lineTo(sectionLineRight, sectionLineTotalTop)
    .lineTo(sectionLineRight, sectionLineTotalBottom)
    .lineTo(sectionLineLeft, sectionLineTotalBottom)
    .lineTo(sectionLineLeft, sectionLineTotalTop)
    .stroke();
};


module.exports = { generaSeccionSubTotal };
