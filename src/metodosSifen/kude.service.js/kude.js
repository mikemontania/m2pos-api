const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { exec } = require('child_process');

// Ejecutar la función
 
async function parseXML(filePath) {
    const xmlData = fs.readFileSync(filePath, 'utf-8');
    const parser = new xml2js.Parser();
    return parser.parseStringPromise(xmlData);
}
 
async function generatePDF(xmlFile ) {
const jasperDir = "./DE"
const outputDir ="ruta/de/salida"



    try {
        const jsonData = await parseXML(xmlFile);

        // Extraer datos del XML
        const tipoDocumento = parseInt(jsonData.rDE.DE[0].gTimb[0].iTiDE[0], 10);
        const timbrado = jsonData.rDE.DE[0].gTimb[0].dNumTim[0];
        const establecimiento = jsonData.rDE.DE[0].gTimb[0].dEst[0];
        const punto = jsonData.rDE.DE[0].gTimb[0].dPunExp[0];
        const numero = jsonData.rDE.DE[0].gTimb[0].dNumDoc[0];
        
        // Determinar la plantilla Jasper según tipo de documento
        const jasperTemplates = {
            1: "Factura.jasper",
            2: "FacturaImportacion.jasper",
            3: "FacturaExportacion.jasper",
            4: "AutoFactura.jasper",
            5: "NotaCredito.jasper",
            6: "NotaDebito.jasper",
            7: "NotaRemision.jasper"
        };

        const jasperFile = jasperTemplates[tipoDocumento];
        if (!jasperFile) throw new Error("Tipo de documento no soportado");

        const jasperPath = path.join(jasperDir, jasperFile);
        if (!fs.existsSync(jasperPath)) throw new Error(`Archivo Jasper no encontrado: ${jasperPath}`);

        // Nombre del PDF de salida
        const outputFileName = `Documento_${timbrado}-${establecimiento}-${punto}-${numero}.pdf`;
        const outputFilePath = path.join(outputDir, outputFileName);

        // Ejecutar JasperReports con Java
        const cmd = `java -jar jasperstarter.jar process "${jasperPath}" -o "${outputFilePath}" -f pdf`;

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error generando PDF: ${stderr}`);
                return;
            }
            console.log(`PDF generado exitosamente en: ${outputFilePath}`);
        });

    } catch (error) {
        console.error("Error procesando el archivo:", error);
    }
}
module.exports = {
    generatePDF  
};


