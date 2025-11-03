const PDFDocument = require("pdfkit");

// ============================================
// UTILIDADES
// ============================================

const formatearFecha = (fechaISO) => {
  if (!fechaISO) return '';
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anho = fecha.getFullYear();
  return `${dia}/${mes}/${anho}`;
};

const formatearHora = (hora) => {
  if (!hora) return '';
  return hora.substring(0, 5); // HH:MM
};

// ============================================
// GENERADORES DE CONTENIDO
// ============================================

const generarEncabezado = (doc, empresaInfo) => {
  const margen = 30;
  
  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("REGISTRO DE ELABORACIÓN", margen, 30, { align: "center" });
  
  doc
    .fontSize(10)
    .font("Helvetica")
    .text(empresaInfo.razonSocial || "Empresa", margen, 55, { align: "center" })
    .text(`RUC: ${empresaInfo.ruc || "N/A"}`, { align: "center" });

  doc.moveDown(1);
   
  return doc.y;
};

const dibujarLineaHorizontal = (doc, y) => {
  doc
    .moveTo(30, y)
    .lineTo(doc.page.width - 30, y)
    .stroke();
};

const generarCabeceraTabla = (doc, yInicial) => {
  const margen = 30;
  const anchoTotal = doc.page.width - 60;
  
  // Posiciones de columnas (ajustadas para landscape)
  const cols = {
    fecha: margen,
    lote: margen + 55,
    loteCultivo: margen + 130,
    litros: margen + 235,
    horaCultivo: margen + 275,
    temp: margen + 330,
    cultivoTipo: margen + 370,
    cultivoLote: margen + 405,
    cultivoVto: margen + 475,
    ph: margen + 555,
    horaFiltrado: margen + 590,
    fechaEnvasado: margen + 645,
    fechaVto: margen + 715
  };

  let y = yInicial;
  
  // Fondo gris para cabecera
  doc
    .rect(margen, y, anchoTotal, 30)
    .fill('#e0e0e0');
  
  y += 8;
  
  doc
    .fillColor('#000000')
    .font("Helvetica-Bold")
    .fontSize(7);
  
  // Línea 1 de cabecera
  doc
    .text("Fecha de", cols.fecha, y, { width: 50, align: "center" })
    .text("", cols.lote, y, { width: 70, align: "center" })
    .text("Lote y", cols.loteCultivo, y, { width: 100, align: "center" })
    .text("Cantidad", cols.litros, y, { width: 35, align: "center" })
    .text("Hora de", cols.horaCultivo, y, { width: 50, align: "center" })
    .text("Temperatura de", cols.temp, y, { width: 35, align: "center" })
    .text("Cultivo", cols.cultivoTipo, y, { width: 30, align: "center" })
    .text("Cultivo", cols.cultivoLote, y, { width: 65, align: "center" })
    .text("Cultivo", cols.cultivoVto, y, { width: 75, align: "center" })
    .text("pH de", cols.ph, y, { width: 30, align: "center" })
    .text("Hora de", cols.horaFiltrado, y, { width: 50, align: "center" })
    .text("Fecha de", cols.fechaEnvasado, y, { width: 65, align: "center" })
    .text("Fecha de", cols.fechaVto, y, { width: 65, align: "center" });
  
  y += 9;
  
  // Línea 2 de cabecera
  doc
    .text("Elaboración", cols.fecha, y, { width: 50, align: "center" })
    .text("lote", cols.lote, y, { width: 70, align: "center" })
    .text("Vencimiento", cols.loteCultivo, y, { width: 100, align: "center" })
    .text("Litros", cols.litros, y, { width: 35, align: "center" })
    .text("Cultivo", cols.horaCultivo, y, { width: 50, align: "center" })
    .text("cultivo.", cols.temp, y, { width: 35, align: "center" })
    .text("Tipo", cols.cultivoTipo, y, { width: 30, align: "center" })
    .text("Lote", cols.cultivoLote, y, { width: 65, align: "center" })
    .text("Vencimiento", cols.cultivoVto, y, { width: 75, align: "center" })
    .text("Maduración", cols.ph, y, { width: 30, align: "center" })
    .text("Filtrado", cols.horaFiltrado, y, { width: 50, align: "center" })
    .text("Envasado", cols.fechaEnvasado, y, { width: 65, align: "center" })
    .text("Vencimiento", cols.fechaVto, y, { width: 65, align: "center" });
  
  y += 9;
  
  // Línea 3 de cabecera (unidades)
  doc
    .fontSize(6)
    .text("", cols.fecha, y, { width: 50, align: "center" })
    .text("", cols.lote, y, { width: 70, align: "center" })
    .text("", cols.loteCultivo, y, { width: 100, align: "center" })
    .text("", cols.litros, y, { width: 35, align: "center" })
    .text("", cols.horaCultivo, y, { width: 50, align: "center" })
    .text("41 a 44 C", cols.temp, y, { width: 35, align: "center" })
    .text("", cols.cultivoTipo, y, { width: 30, align: "center" })
    .text("", cols.cultivoLote, y, { width: 65, align: "center" })
    .text("", cols.cultivoVto, y, { width: 75, align: "center" })
    .text("4.7 a 4.8", cols.ph, y, { width: 30, align: "center" })
    .text("", cols.horaFiltrado, y, { width: 50, align: "center" })
    .text("", cols.fechaEnvasado, y, { width: 65, align: "center" })
    .text("", cols.fechaVto, y, { width: 65, align: "center" });
  
  y += 12;
  dibujarLineaHorizontal(doc, y);
  
  return { y: y + 5, cols };
};

const generarFilaDetalle = (doc, registro, detalle, cols, y) => {
  const altoFila = 18;
  
  // Verificar si necesitamos nueva página
  if (y > doc.page.height - 80) {
    doc.addPage({ layout: 'landscape' });
    const resultado = generarCabeceraTabla(doc, 30);
    cols = resultado.cols; // Actualizar cols si cambiamos de página
    y = resultado.y;
  }
  
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor('#000000');
  
  // Datos del registro (se repiten por cada variante)
  doc
    .text(formatearFecha(registro.fechaElaboracion), cols.fecha, y, { width: 50, align: "center" })
    .text(registro.numeroLoteProduccion || '', cols.lote, y, { width: 70, align: "center" })
    .text(`${detalle.variante?.variedad?.descripcion || ''} ${detalle.variante?.presentacion?.descripcion || ''}`, 
          cols.loteCultivo, y, { width: 100, align: "left" })
    .text(registro.cantidadLitros.toString(), cols.litros, y, { width: 35, align: "center" })
    .text(formatearHora(registro.horaCultivo), cols.horaCultivo, y, { width: 50, align: "center" })
    .text(registro.temperaturaCultivo.toString(), cols.temp, y, { width: 35, align: "center" })
    .text(registro.cultivo?.codigo || '', cols.cultivoTipo, y, { width: 30, align: "center" })
    .text(registro.numeroLoteCultivo || '', cols.cultivoLote, y, { width: 65, align: "center" })
    .text(formatearFecha(registro.fechaVencimientoCultivo), cols.cultivoVto, y, { width: 75, align: "center" })
    .text(registro.phMaduracion.toString(), cols.ph, y, { width: 30, align: "center" })
    .text(formatearHora(registro.horaFiltrado), cols.horaFiltrado, y, { width: 50, align: "center" })
    .text(formatearFecha(registro.fechaEnvasado), cols.fechaEnvasado, y, { width: 65, align: "center" })
    .text(formatearFecha(detalle.fechaVencimiento), cols.fechaVto, y, { width: 65, align: "center" });
  
  y += altoFila;
  
  // Línea separadora sutil
  doc
    .moveTo(30, y - 3)
    .lineTo(doc.page.width - 30, y - 3)
    .lineWidth(0.5)
    .strokeColor('#cccccc')
    .stroke()
    .lineWidth(1)
    .strokeColor('#000000');
  
  return { y, cols }; // Retornar cols actualizado
};

/* const generarColumnasAdicionales = (doc, yInicial) => {
  const margen = 30;
  let y = yInicial + 5;
  
  // Segunda sección de columnas
  const cols2 = {
    natura: margen,
    natural: margen + 35,
    coco: margen + 70,
    esenciaVainilla: margen + 105,
    vainilla: margen + 190,
    esenciaVainillaVto: margen + 225,
    realizadoPor: margen + 310,
    firma: margen + 370
  };
  
  // Fondo gris
  doc
    .rect(margen, y, doc.page.width - 60, 25)
    .fill('#e0e0e0');
  
  y += 7;
  
  doc
    .fillColor('#000000')
    .font("Helvetica-Bold")
    .fontSize(7);
  
  // Línea 1
  doc
    .text("Natura", cols2.natura, y, { width: 30, align: "center" })
    .text("Natural", cols2.natural, y, { width: 30, align: "center" })
    .text("Coco", cols2.coco, y, { width: 30, align: "center" })
    .text("Esencia", cols2.esenciaVainilla, y, { width: 80, align: "center" })
    .text("Vainilla", cols2.vainilla, y, { width: 30, align: "center" })
    .text("Esencia de Vainilla", cols2.esenciaVainillaVto, y, { width: 80, align: "center" })
    .text("Realizado", cols2.realizadoPor, y, { width: 55, align: "center" })
    .text("Firma", cols2.firma, y, { width: 100, align: "center" });
  
  y += 9;
  
  // Línea 2
  doc
    .text("318g", cols2.natura, y, { width: 30, align: "center" })
    .text("211cl", cols2.natural, y, { width: 30, align: "center" })
    .text("211cl", cols2.coco, y, { width: 30, align: "center" })
    .text("de Coco", cols2.esenciaVainilla, y, { width: 80, align: "center" })
    .text("318g", cols2.vainilla, y, { width: 30, align: "center" })
    .text("Vencimiento", cols2.esenciaVainillaVto, y, { width: 80, align: "center" })
    .text("Por", cols2.realizadoPor, y, { width: 55, align: "center" })
    .text("", cols2.firma, y, { width: 100, align: "center" });
  
  y += 12;
  dibujarLineaHorizontal(doc, y);
  
  return { y: y + 5, cols2 };
};

const generarFilaAdicional = (doc, registro, detalle, cols2, y) => {
  const altoFila = 18;
  
  // Verificar si necesitamos nueva página
  if (y > doc.page.height - 80) {
    doc.addPage({ layout: 'landscape' });
    const resultado = generarColumnasAdicionales(doc, 30);
    cols2 = resultado.cols2; // Actualizar cols2 si cambiamos de página
    y = resultado.y;
  }
  
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor('#000000');
  
  // Extraer cantidades por tipo de variante
  const variante = detalle.variante;
  const descripcion = `${variante?.variedad?.descripcion || ''} ${variante?.presentacion?.descripcion || ''}`;
  
  let natura = '';
  let natural = '';
  let coco = '';
  let vainilla = '';
  
  if (descripcion.toLowerCase().includes('natura')) natura = detalle.cantidad.toString();
  if (descripcion.toLowerCase().includes('natural') && !descripcion.toLowerCase().includes('natura')) natural = detalle.cantidad.toString();
  if (descripcion.toLowerCase().includes('coco')) coco = detalle.cantidad.toString();
  if (descripcion.toLowerCase().includes('vainilla')) vainilla = detalle.cantidad.toString();
  
  doc
    .text(natura, cols2.natura, y, { width: 30, align: "center" })
    .text(natural, cols2.natural, y, { width: 30, align: "center" })
    .text(coco, cols2.coco, y, { width: 30, align: "center" })
    .text(detalle.numeroLoteEsencia || '', cols2.esenciaVainilla, y, { width: 80, align: "center" })
    .text(vainilla, cols2.vainilla, y, { width: 30, align: "center" })
    .text(formatearFecha(detalle.fechaVencimientoEsencia), cols2.esenciaVainillaVto, y, { width: 80, align: "center" })
    .text(registro.realizadoPor || '', cols2.realizadoPor, y, { width: 55, align: "center" })
    .text('', cols2.firma, y, { width: 100, align: "center" });
  
  y += altoFila;
  
  // Línea separadora
  doc
    .moveTo(30, y - 3)
    .lineTo(doc.page.width - 30, y - 3)
    .lineWidth(0.5)
    .strokeColor('#cccccc')
    .stroke()
    .lineWidth(1)
    .strokeColor('#000000');
  
  return { y, cols2 }; // Retornar cols2 actualizado
}; */

const generarPiePagina = (doc, numeroPagina) => {
  const margen = 30;
  const y = doc.page.height - 40;
  
  doc
    .font("Helvetica")
    .fontSize(8)
    .text(`Página ${numeroPagina}`, margen, y, { align: "left" })
    .text(`Generado: ${formatearFecha(new Date())} ${new Date().toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit' })}`, 
          margen, y, { align: "right" });
};

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

const crearPDFElaboracion = (registros, empresaInfo) => {
 const doc = new PDFDocument({
  size: 'A4',
  layout: 'landscape',
  margin: 30,
  bufferPages: true    
});


  // Encabezado
  generarEncabezado(doc, empresaInfo);
  
  // Primera sección de columnas
  let resultado = generarCabeceraTabla(doc, doc.y + 10);
  let y = resultado.y;
  let cols = resultado.cols;
  
  // Procesar cada registro y sus detalles
  registros.forEach(registro => {
    if (registro.detalles && registro.detalles.length > 0) {
      registro.detalles.forEach(detalle => {
        const res = generarFilaDetalle(doc, registro, detalle, cols, y);
        y = res.y;
        cols = res.cols; // Actualizar cols en caso de cambio de página
      });
    }
  });
  
  // Nueva página para columnas adicionales
 /*  doc.addPage({ layout: 'landscape' });
  generarEncabezado(doc, empresaInfo);
  
  resultado = generarColumnasAdicionales(doc, doc.y + 10);
  y = resultado.y;
  let cols2 = resultado.cols2;
  
  // Procesar datos adicionales
  registros.forEach(registro => {
    if (registro.detalles && registro.detalles.length > 0) {
      registro.detalles.forEach(detalle => {
        const res = generarFilaAdicional(doc, registro, detalle, cols2, y);
        y = res.y;
        cols2 = res.cols2; // Actualizar cols2 en caso de cambio de página
      });
    }
  }); */
  
  // Pie de página en todas las páginas
  const totalPaginas = doc.bufferedPageRange().count;
  for (let i = 0; i < totalPaginas; i++) {
    doc.switchToPage(i);
    generarPiePagina(doc, i + 1);
  }
  
  doc.end();
  return doc;
};

module.exports = {
  crearPDFElaboracion
};