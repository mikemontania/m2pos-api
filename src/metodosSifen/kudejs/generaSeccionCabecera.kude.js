const fs = require('fs');
const { titleCase, formatDate } = require('./util.kude');


const generarCabecera = (doc, datosDocumento, img, headerLineLeft, headerLineRight, headerLineTop ,headerLineBottom) => { 
  return new Promise(async (resolve, reject) => {
    try {
    const { emisor, timbrado } = datosDocumento;
      const logoPath = `./src/uploads/empresas/${img}`; 
    /*
    /A4 (595.28 x 841.89)
  const hojaVerticalAlto =841.89;
  const hojaVerticalAncho =595.28;
    const headerLineLeft = 20;
    const headerLineRight =hojaVerticalAncho-20;
    
    */
     
      const topBloque = headerLineTop + 10;
      const inicioBloque2 = 100; 
      const anchoBloque2 = 440;
      const barraVertical = headerLineLeft + anchoBloque2;
      
      // Dibujar la cuadrícula y el logo
      dibujarCuadricula(doc, headerLineLeft, headerLineRight, headerLineBottom, barraVertical, headerLineTop);
      agregarLogo(doc, logoPath);
    
      // 🏷 Encabezado (SEPARADO DEL BLOQUE 2)
      doc
        .fillColor("#000000")
        .font("Helvetica-Bold")
        .fontSize(8)
        .text("KuDE de Factura electrónica", inicioBloque2, topBloque - 8, { width: anchoBloque2, align: 'center' });
    
      // 📦 Datos del Emisor
      dibujarDatosEmisor(doc, emisor, topBloque, inicioBloque2, barraVertical);
    
      // 📜 Datos del Timbre
      dibujarDatosTimbrado(doc, timbrado,emisor, topBloque, barraVertical);
      resolve( ); // Se resuelve cuando todo ha terminado


    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
  
  const dibujarCuadricula = (doc, headerLineLeft, headerLineRight, headerLineBottom, barraVertical, headerLineTop) => {
    // Establecer el grosor de las líneas (por ejemplo, 2)
    doc.lineWidth(1); // Esto hará que las líneas sean más gruesas
  
    // Dibujar cuadrícula alrededor del header
    doc
      .moveTo(headerLineLeft, headerLineTop)
      .lineTo(headerLineRight, headerLineTop)
      .lineTo(headerLineRight, headerLineBottom)
      .lineTo(headerLineLeft, headerLineBottom)
      .lineTo(headerLineLeft, headerLineTop)
      .stroke("#333333");  // Línea más gruesa y color oscuro (gris oscuro)
  
    doc
      .moveTo(barraVertical, headerLineTop)
      .lineTo(barraVertical, headerLineBottom)
      .stroke("#333333");  // Línea más gruesa y color oscuro (gris oscuro)
    };
  
  
  const agregarLogo = (doc, logoPath) => {
    if (fs.existsSync(logoPath)) {
      // Logo en la parte superior izquierda
      doc.image(logoPath, 40, 30, { width: 50 });
    }
  };
  
  const dibujarDatosEmisor = (doc, emisor, topBloque, inicioBloque2, barraVertical) => {
    const actividades = emisor?.gActEco?.map(act => ({ titulo: "",  salto: true,  valor: titleCase(act.dDesActEco[0]) })) ?? [];    const datosEmisor = [
      { titulo: "", valor: emisor?.dNomEmi?.[0] ?? "N/D", salto: false },
      { titulo: "", valor: emisor?.dNomFanEmi?.[0] ?? "N/D", salto: false },
       ...actividades,
      { titulo: "", valor: `${titleCase(emisor?.dDesCiuEmi?.[0])}, ${titleCase(emisor?.dDirEmi?.[0])}`, salto: true },
      { titulo: "Teléfono:", valor: emisor?.dTelEmi?.[0] ?? "N/D", salto: true },
      { titulo: "Celular:", valor: emisor?.dCelRec?.[0] ?? "N/D", salto: true },
      { titulo: "Email:", valor: emisor?.dEmailE?.[0] ?? "N/D", salto: true }
    ];
  
    let lastTextPosition = topBloque; // Para calcular dinámicamente la altura
    datosEmisor.forEach((campo, index) => {
      if (campo.valor && campo.valor !== "N/D") {
        doc
          .fillColor("#444444")
          .font("Helvetica")
          .text(campo.titulo, inicioBloque2, lastTextPosition , { continued: true });
  
        doc
          .fillColor("#444444")
          .font("Helvetica")
          .text(" " + campo.valor);
  
        lastTextPosition += 10; // Ajustar espacio entre líneas
      }
    });
};

  const dibujarDatosTimbrado = (doc, timbrado,emisor, topBloque, barraVertical) => {
    const bloque3 = [
      { titulo: "RUC:", valor: `${emisor?.dRucEm?.[0] ?? "N/D"}-${emisor?.dDVEmi?.[0] ?? ""}`, top: topBloque+20 },
      { titulo: "Vigencia desde:", valor: formatDate(timbrado?.dFeIniT?.[0] ?? "N/D"), top: topBloque + 30 },
      { titulo: "Timbrado N°:", valor: timbrado?.dNumTim?.[0] ?? "N/D", top: topBloque + 40 },
      { titulo: "Factura Electrónica", valor: '', top: topBloque + 50 },
      { titulo: "N°:", valor: `${timbrado?.dEst?.[0] ?? "N/D"}-${timbrado?.dPunExp?.[0] ?? "N/D"}-${timbrado?.dNumDoc?.[0] ?? "N/D"}`, top: topBloque + 60 }
    ];
  
    bloque3.forEach(campo => {
      doc
        //.fillColor("#000000") // Más oscuro para los títulos
        .font("Helvetica-Bold")
        .text(campo.titulo, barraVertical + 5, campo.top, { continued: true });
  
      doc
        //.fillColor("#444444") // Más claro para los valores
        .font("Helvetica")
        .text(" " + campo.valor);
    });
  };

  module.exports = { generarCabecera };