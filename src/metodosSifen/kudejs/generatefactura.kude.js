const PDFDocument = require('pdfkit');
const fs = require('fs');
const { parseStringPromise } = require("xml2js");

const generatePDF = (xmlData, img) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);
 
        addHeader(doc,xmlData,img);
        addDocumentInfo(doc, xmlData);
        addEmisorInfo(doc, xmlData);
        addReceptorInfo(doc, xmlData);
        addItems(doc, xmlData);
        addTotals(doc, xmlData);
        addQRCode(doc, xmlData);
        
        doc.end();
    });
};
 

const addHeader = (doc, xmlData, img) => {
    const logoPath = `./src/uploads/empresas/${img}`;
    if (fs.existsSync(logoPath)) { 
        // Logo en la parte superior izquierda
        doc.image(logoPath, 50, 50, { width: 100 }).moveDown(2);
    }

    // Dividir la cabecera en tres partes
    const xStart = 200;  // Punto de inicio para los datos
    const emisor = xmlData.rDE.DE[0].gDatGralOpe[0].gEmis[0];  
    console.log(JSON.stringify(emisor, null, 2)); // Verifica la estructura del XML
    
    // Datos del emisor (parte izquierda)
    doc.fontSize(12).font('Helvetica-Bold').text("Datos del Emisor", { align: "left" });
    doc.fontSize(10).font('Helvetica').text(`Nombre o Razón Social: ${emisor.dNomEmi[0]}`);
    doc.text(`Nombre Fantasía: ${emisor.dNomFanEmi[0]}`);
    doc.text(`Ruc: ${emisor.dRucEm[0]}`);
    
    // Obtener la descripción de la actividad (puedes mostrar todas las actividades si son múltiples)
    const actividades = emisor.gActEco.map(act => act.dDesActEco[0]).join(', ');
    doc.text(`Descripción de Actividad: ${actividades}`);

    doc.text(`Dirección: ${emisor.dDirEmi[0]}`);
    doc.text(`Ciudad: ${emisor.dDesCiuEmi[0]}`).moveDown();
   
    // Línea de separación
    doc.moveTo(xStart, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
    doc.moveDown(1);
    

    const gTimb = xmlData.rDE.DE[0].gTimb[0]; 
    // Datos de timbrado (parte derecha)
    doc.fontSize(12).font('Helvetica-Bold').text("Datos de Timbrado", { align: "left" });
    doc.fontSize(10).font('Helvetica').text(`Timbrado Nº: ${gTimb.dNumTim[0]}`);
    doc.text(`Fecha de inicio de vigencia: ${xmlData.rDE.DE[0].gDatGralOpe[0].dFeEmiDE[0]}}`); 
    doc.text(`${gTimb.dEst[0]}-${gTimb.dPunExp[0]}-${gTimb.dNumDoc[0]}`).moveDown();
    
    // Otra línea de separación
    doc.moveTo(xStart, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
    doc.moveDown(1);

    // Título principal de la factura
    doc.fontSize(16).font('Helvetica-Bold').text("KUDE - Documento Electrónico", { align: "center" });
    doc.moveDown();
};


const addDocumentInfo = (doc, xmlData) => {
    const gTimb = xmlData.rDE.DE[0].gTimb[0];
    doc.fontSize(12).text(`Tipo de Documento: ${gTimb.dDesTiDE[0]}`);
    doc.text(`Timbrado: ${gTimb.dNumTim[0]}`);
    doc.text(`Establecimiento: ${gTimb.dEst[0]} - Punto de Expedición: ${gTimb.dPunExp[0]} - Número: ${gTimb.dNumDoc[0]}`);
    doc.text(`Fecha de Emisión: ${xmlData.rDE.DE[0].gDatGralOpe[0].dFeEmiDE[0]}`);
    doc.moveDown();
};

const addEmisorInfo = (doc, xmlData) => {
    const emisor = xmlData.rDE.DE[0].gDatGralOpe[0].gEmis[0];   
    if (emisor) {
        doc.fontSize(12).text(`Emisor: ${emisor.dNomFanEmi[0]}`);
        doc.text(`RUC: ${emisor.dRucEm[0]}-${emisor.dDVEmi[0]}`);
        doc.text(`Dirección: ${emisor.dDirEmi[0]}, ${emisor.dDesCiuEmi[0]}, ${emisor.dDesDepEmi[0]}`);
        doc.text(`Teléfono: ${emisor.dTelEmi[0]}`);
        doc.text(`Email: ${emisor.dEmailE[0]}`);
        doc.moveDown();
    } else { 
        doc.fontSize(12).text('Emisor: Información no disponible');
    }
};

const addReceptorInfo = (doc, xmlData) => {
    const receptor = xmlData.rDE.DE[0].gDatGralOpe[0].gDatRec[0];
    doc.fontSize(12).text(`Receptor: ${receptor.dNomRec[0]}`);
    doc.text(`RUC: ${receptor.dRucRec[0]}-${receptor.dDVRec[0]}`);
    doc.text(`Dirección: ${receptor.dDirRec[0]}`);
    doc.moveDown();
};

const addItems = (doc, xmlData) => {
    const gDtipDE =xmlData.rDE.DE[0].gDtipDE[0];
   //  console.log(JSON.stringify(gDtipDE, null, 2));
    const items =gDtipDE.gCamItem;
   // console.log(JSON.stringify(items, null, 2));
    doc.fontSize(12).text("Detalles del Documento:", { underline: true });
    items.forEach((item, index) => {
        const total = (item.gValorItem && item.gValorItem[0] && item.gValorItem[0].dTotOpeItem && item.gValorItem[0].dTotOpeItem[0]) 
            ? item.gValorItem[0].dTotOpeItem[0] 
            : 'N/A'; // Default value if undefined
        doc.text(`${index + 1}. ${item.dDesProSer[0]} - Cantidad: ${item.dCantProSer[0]} - Precio: ${item.gValorItem[0].dPUniProSer[0]} - Total: ${total}`);
    });
    doc.moveDown();
};

const addTotals = (doc, xmlData) => {
    const totales = xmlData.rDE.DE[0].gTotSub[0];
    doc.fontSize(12).text(`Subtotal Exento: ${totales.dSubExe[0]}`);
    doc.text(`Subtotal Gravado 5%: ${totales.dSub5[0]}`);
    doc.text(`Subtotal Gravado 10%: ${totales.dSub10[0]}`);
    doc.text(`Total Operación: ${totales.dTotOpe[0]}`);
    doc.text(`Total IVA: ${totales.dTotIVA[0]}`);
    doc.text(`Total General: ${totales.dTotGralOpe[0]}`);
    doc.moveDown();
};

const addQRCode = (doc, xmlData) => {
    const gCamFuFD =xmlData.rDE.gCamFuFD[0];
      console.log(JSON.stringify(gCamFuFD, null, 2));  
    const qrData = gCamFuFD.dCarQR[0];
    doc.fontSize(12).text(`Código QR: ${qrData}`);
};

const createFacturaKude = async (xmlfirmado, img) => {
    try {
      //  console.log(xmlfirmado);
        const xmlData = await parseStringPromise(xmlfirmado);
     //   console.log(xmlData);
      //  console.log(JSON.stringify(xmlData, null, 2)); // Verifica la estructura del XML
        return generatePDF(xmlData, img);
    } catch (error) {
        console.error("Error procesando XML:", error);
        throw error;
    }
};

module.exports = { createFacturaKude };
