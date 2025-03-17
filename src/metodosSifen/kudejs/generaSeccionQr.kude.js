const { formatearId } = require('./util.kude');
const fs = require('fs');
const QRCode = require('qrcode');
const path = require('path');
const os = require('os');
const margen = 5;
const generaSeccionQr = async (doc, informacionGeneral, sectionLineLeft, sectionLineRight, sectionLineTop, sectionLineBottom) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { gCamFuFD } = informacionGeneral;

      // Dibujar cuadrícula
      await dibujarCuadricula(doc, sectionLineLeft, sectionLineRight, sectionLineBottom, sectionLineTop);
      
      // Agregar texto a la derecha
      await generaSeccionTextoDerecha(doc, informacionGeneral, sectionLineLeft, sectionLineRight, sectionLineTop);

      if (!gCamFuFD || !gCamFuFD.dCarQR || !gCamFuFD.dCarQR[0]) {
        return reject(new Error("Datos de QR inválidos o vacíos."));
      }

      // Generar y agregar QR
      const png = await generaQr(gCamFuFD.dCarQR[0]);
      if (!png || png.length === 0) {
        console.error("No se pudo generar la imagen del QR.");
        return reject(new Error("No se pudo generar la imagen del QR."));
      }

   

      // Insertar en el PDF
      doc.image(png, sectionLineLeft + margen, sectionLineTop + margen, { width: 70, height: 70 });

      resolve(); // Se resuelve cuando todo ha terminado

    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

// Generar QR como Buffer
const generaQr = (url) => {
  return new Promise((resolve, reject) => {
    QRCode.toBuffer(url, { type: 'png' })
      .then((png) => {
        console.log("QR png generado correctamente.");
        resolve(png);
      })
      .catch((error) => {
        console.error("Error al generar el código QR:", error);
        reject(error);
      });
  });
};

// Dibujar la cuadrícula (marco de la sección)
const dibujarCuadricula = (doc, sectionLineLeft, sectionLineRight, sectionLineBottom, sectionLineTop) => {
  return new Promise((resolve) => {
    doc.fillColor("#000000");
    doc.lineWidth(1).strokeColor("#333333")
      .moveTo(sectionLineLeft, sectionLineTop)
      .lineTo(sectionLineRight, sectionLineTop)
      .lineTo(sectionLineRight, sectionLineBottom)
      .lineTo(sectionLineLeft, sectionLineBottom)
      .lineTo(sectionLineLeft, sectionLineTop)
      .stroke();
    resolve();
  });
};

// Agregar textos en la sección QR
const generaSeccionTextoDerecha = (doc, informacionGeneral, sectionLineLeft, sectionLineRight, sectionLineTop) => {
  return new Promise((resolve, reject) => {
    try {
      const { id, gCamFuFD } = informacionGeneral;

      // Determinar el enlace correcto
      const urlBase = gCamFuFD?.dCarQR?.[0]?.includes("consultas-test") 
        ? "https://ekuatia.set.gov.py/consultas-test/"
        : "https://ekuatia.set.gov.py/consultas/";

      doc.fontSize(8).text('Consulte la validez de esta Factura Electrónica con el número de CDC impreso abajo en:', sectionLineLeft + 120, sectionLineTop + 10, {
        width: sectionLineRight - sectionLineLeft - 120,
        align: 'left',
        paragraphGap: 6
      });

      // Agregar hipervínculo en negro, sin subrayado, tamaño 10
      doc.fillColor("black").fontSize(10).text(urlBase, sectionLineLeft + 120, sectionLineTop + 22, {
        width: sectionLineRight - sectionLineLeft - 120,
        align: 'left',
        link: urlBase, // Agregar el enlace
      });

      doc.fontSize(12).text(formatearId(id), sectionLineLeft + 120, sectionLineTop + 40, {
        width: sectionLineRight - sectionLineLeft - 120,
        align: 'left',
      });

      doc.fontSize(8).text('ESTE DOCUMENTO ES UNA REPRESENTACIÓN GRÁFICA DE UN DOCUMENTO ELECTRÓNICO (XML)', sectionLineLeft + 120, sectionLineTop + 60, {
        width: sectionLineRight - sectionLineLeft - 120,
        align: 'left',
        paragraphGap: 6
      });

      doc.fontSize(7).text(
        'Si su documento electrónico presenta algún error puede solicitar la modificación dentro de las 72 horas siguientes de la emisión de este comprobante.',  
        sectionLineLeft + margen, sectionLineTop + 80
      );

      resolve();
    } catch (error) {
      console.error("Error al generar el texto:", error);
      reject(error);
    }
  });
};

module.exports = { generaSeccionQr };
