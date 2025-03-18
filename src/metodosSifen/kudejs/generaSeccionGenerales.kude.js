const fs = require('fs');
const { titleCase, formatDate } = require('./util.kude');


 const generarSeccionGeneral = (doc,datosDocumento ,sectionLineLeft,sectionLineRight, generalLineTop,generalLineBottom) => {
  return new Promise(async (resolve, reject) => {
try{
  
  const barraVertical1 = 330;  
  // Llamar a la función para dibujar la cuadrícula
  generarCuadriculaDatosGenerales(doc, sectionLineLeft, sectionLineRight, generalLineTop, generalLineBottom, barraVertical1);

    // Agregar los datos dentro de la sección
   // agregarDatosReceptorOperacion(doc, receptor, operacion, sectionLineLeft, barraVertical1, generalLineTop);
    // Agregar los datos dentro de la sección
  agregarDatosReceptorOperacion(doc, datosDocumento , sectionLineLeft, barraVertical1, generalLineTop);
   
    resolve( ); // Se resuelve cuando todo ha terminado
  } catch (error) {
    console.error(error);
    reject(error);
  }
  });
 
   
    };
 
    const agregarDatosReceptorOperacion = (doc, datosDocumento, sectionLineLeft, barraVertical1, generalLineTop) => {
    
      const { receptor,  operacion,condicionesPago,operacionCom, fechaEmision} =datosDocumento;
      
      const fecha = (fechaEmision) ?fechaEmision.toString().substring(0, 10):''; 

      const datos = [
        { titulo: "Fecha y hora de emisión:", valor: formatDate(fecha) ?? "" },//D002
        { titulo: "Condición Venta:", valor: condicionesPago?.dDCondOpe?.[0] ?? "" }, //E602
        { titulo: "Moneda:", valor: operacionCom?.cMoneOpe?.[0] ?? "" },//E644
        { titulo: "Descripción de moneda de la operación:", valor: operacionCom?.dDesMoneOpe?.[0] ?? "" },//E644
        {titulo:   condicionesPago.gPagCred?.[0]?.iCondCred?.[0] == 2 ? condicionesPago.gPagCred?.[0]?.dCuotas?.[0] :  condicionesPago.gPagCred?.[0]?.dPlazoCre?.[0]     ?? ""},
         { titulo: "Tipo de transacción:", valor: operacionCom?.dDesTipTra ?? "" },
      ];
       const datos2 = [
        { titulo: receptor?.iNatRec == 1 ? "RUC:" : "Documento de identidad:", valor: receptor?.iNatRec == 1 ? `${receptor?.dRucRec ?? ""}-${receptor?.dDVRec ?? ""}` : receptor?.dNumIDRec ?? "" },
        { titulo: receptor?.iNatRec == 1 ? "Razón Social:" : "Nombre:", valor: receptor?.dNomRec ?? "" },
        { titulo: "Dirección:", valor: receptor?.dDirRec ?? "" },
        { titulo: "Teléfono:", valor: receptor?.dTelRec ?? "" },
        { titulo: "Email:", valor: receptor?.dEmailRec ?? "" },
        
      ];
      let yPosDat1 = generalLineTop + 5;
      datos.forEach(({ titulo, valor }) => {
        if (titulo) {
          doc.font("Helvetica-Bold").text(titulo, sectionLineLeft + 5, yPosDat1, { continued: true });
          doc.font("Helvetica").text(" " + valor);
          yPosDat1 += 12;
        }
      });
      let yPosDat2 = generalLineTop + 5;

      datos2.forEach(({ titulo, valor }) => {
        if (titulo) {
          doc.font("Helvetica-Bold").text(titulo, barraVertical1 + 5, yPosDat2, { continued: true });
          doc.font("Helvetica").text(" " + valor);
          yPosDat2 += 12;
        }
      });


    };
 
    const generarCuadriculaDatosGenerales = (doc, sectionLineLeft, sectionLineRight, generalLineTop, generalLineBottom, barraVertical1) => {
      // Línea o margen vertical de la izquierda (borde izquierdo de la sección)
   doc
   .moveTo(sectionLineLeft, generalLineTop)  // Inicio en la esquina superior izquierda
   .lineTo(sectionLineLeft, generalLineBottom) // Extiende hacia abajo
   .stroke("#333333"); 

 // Línea o margen vertical de la derecha (borde derecho de la sección)
 doc
   .moveTo(sectionLineRight, generalLineTop) // Inicio en la esquina superior derecha
   .lineTo(sectionLineRight, generalLineBottom) // Extiende hacia abajo
   .stroke("#333333"); 

 // Cuadro completo alrededor de la sección (incluye las líneas superior, derecha, inferior e izquierda)
 doc
   .moveTo(sectionLineLeft, generalLineTop)  // Esquina superior izquierda
   .lineTo(sectionLineRight, generalLineTop) // Línea superior (margen superior)
   .lineTo(sectionLineRight, generalLineBottom) // Línea derecha (margen derecho)
   .lineTo(sectionLineLeft, generalLineBottom)  // Línea inferior (margen inferior)
   .lineTo(sectionLineLeft, generalLineTop) // Línea izquierda (margen izquierdo, cierra el cuadro)
   .stroke("#333333");   

 // Línea media vertical que divide la sección en dos partes
 doc
   .moveTo(barraVertical1, generalLineTop) // Inicia en la parte superior dentro del cuadro
   .lineTo(barraVertical1, generalLineBottom) // Se extiende hacia la parte inferior dentro del cuadro
   .stroke("#333333");  // Línea más gruesa y color oscuro (gris oscuro)
    };
 
  module.exports = { generarSeccionGeneral };