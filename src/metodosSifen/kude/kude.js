const fs = require('fs');
const path = require('path'); // Importa el módulo 'path' para manejar rutas de archivos y directorios
 
// Función para generar el PDF con node-jasper
const generateKude = async (reportName, dataFromXML, xmlFirmado, img) => {
    try {
      // Verificar si la imagen existe
      const pathImg = path.join(__dirname, '../../uploads', 'empresas', img);
      console.log(pathImg)
      if (!img) {
        throw new Error("El parámetro 'img' es inválido.");
      }
      if (!fs.existsSync(pathImg)) {
        console.log(pathImg);
        throw new Error("La imagen no existe.");
      } 


      jasper = require('node-jasper')({
        path: './jar',
        reports: {
           // hw removed from this place
        } 
    });

      jasper = require('node-jasper')({
        path: './jar', // Ruta donde están los JARs
        reports: {
          hw: {
            jasper:   `./reports/${reportName}.jasper`, // Ruta al reporte .jasper
          }
        } 
	});

      const report = {
        report: 'hw',
        data: dataFromXML, 
        params: {
          xmlFirmado: xmlFirmado,
          imgPath: pathImg
        }
    };
  
    if (jasper && typeof jasper.pdf === 'function') {
        console.log(jasper)
        const pdf = jasper.pdf(report);
        console.log(pdf);
        return pdf;
      } else {
        throw new Error("Jasper no está configurado correctamente.");
      }
   
    } catch (error) {
      console.error("Error en la generación del reporte:", error);
    }
  };

module.exports = { generateKude };
