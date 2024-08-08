const xmlbuilder = require("xmlbuilder");
const {
  const_tiposTransacciones,
  const_tiposImpuestos,
  const_departamentos,
  const_distritos,
  const_ciudades,
  const_monedas,
  const_tipoContribuyente,
  const_tiposEmisiones
} = require("../constantes/Constante.constant");






const generaXML = (cabecera, detalles) => {
  const tipoEmision = const_tiposEmisiones.find(t => t.codigo == 1);
  const tipoContribuyente = const_tipoContribuyente.find(t => t.id == cabecera.empresa.tipoContId  );
  const tipoTransacciones = const_tiposTransacciones.find(    t => t.codigo == cabecera.empresa.tipoTransaId  );
  const tipoImpuesto = const_tiposImpuestos.find(    t => t.codigo == cabecera.empresa.tipoImpId  );
  const departamento = const_departamentos.find(    t => t.codigo == cabecera.empresa.depEmiId  );
  const distrito = const_distritos.find(    t => t.codigo == cabecera.empresa.disEmiId  );
  const ciudad = const_ciudades.find(    t => t.codigo == cabecera.empresa.ciuEmiId  );
  const moneda = const_monedas.find(    t => t.codigo == cabecera.empresa.codigoMoneda  );
  const [establecimiento, puntoExp, numero] = cabecera.nroComprobante.split(    "-"  );
  const carQRValue = "****************************************************************************************************";
  // Fechas
  const fechaActualISO = formatDateToISO(new Date());
  const fechaEmisionISO = formatDateToISO(cabecera.fechaCreacion);
  /*
1= B2B
2= B2C
3= B2G
4= B2F
(Esta última opción debe utilizarse
solo en caso de servicios para
empresas o personas físicas del
exterior
*/
let xml = xmlbuilder
.create("rDE", { version: "1.0", encoding: "UTF-8" })
.att("xmlns", "http://ekuatia.set.gov.py/sifen/xsd")
.att("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
.att("xsi:schemaLocation", "http://ekuatia.set.gov.py/sifen/xsd siRecepDE_v150.xsd")
// Header data
.ele("dVerFor", process.env.EKUATIA_VERSION).up()
.ele("DE", { Id: cabecera.cdc })
  .ele("dDVId", cabecera.cdc.charAt(cabecera.cdc.length - 1)).up()
  /*
      La fecha y hora de la firma digital debe ser anterior a la fecha y hora de transmisión al SIFEN
    El certificado digital debe estar vigente al momento de la firma digital del DE Fecha y hora en el formato AAAA-MM-DDThh:mm:ss
    El plazo límite de transmisión del DE al SIFEN para la aprobación normal es de 72 h contadas a partir de la fecha y hora de la firma digital
  */
  .ele("dFecFirma", fechaActualISO).up()
  .ele("dSisFact", "1").up()
  // Operation data
  .ele(createGOpeDE(tipoEmision, cabecera)).up() // Uso de la función modularizada para gOpeDE
  .ele(createGTimb(cabecera, establecimiento, puntoExp, numero)).up() // Uso de la función modularizada
    // Campos generales del DE 
    .ele("gDatGralOpe")
      /* Fecha y hora en el formato AAAA-MM-DDThh:mm:ss Para el KuDE el formato de la fecha de emisión debe contener los guiones separadores. Ejemplo: 2018-05-31T12:00:00
        Se aceptará como límites técnicos del sistema, que la fecha de emisión del DE sea atrasada hasta 720 horas (30 días) y adelantada hasta
        120 horas (5 días) en relación a la fecha y hora de transmisión al SIFEN
      */
      .ele("dFeEmiDE", fechaEmisionISO).up()
      //Campos inherentes a la operación comercial
      .ele(createGOpeCom(tipoTransacciones, tipoImpuesto,moneda)).up() 
      //Grupo de campos que identifican al emisor
      .ele(createGEmis(cabecera, tipoContribuyente, departamento, distrito, ciudad)).up()
    //Grupo de campos que identifican al receptor 
    .ele(createGDatRec(cabecera)).up() // Uso de la función modularizada para gDatRec
    .up()//cierre gDatGralOpe
    // Campos específicos por tipo de Documento Electrónico
    .ele("gDtipDE")
      .ele(createGCamFE()).up() //Campos que componen la FE
      //Campos que describen la condición de la operación
      .ele(createGCamCond(cabecera.formaVenta, cabecera.importeTotal)).up()     
      //Campos que describen los ítems de la operación
      .ele(detalles.map(item => createGCamItem(item))).up()
    .up()
    //Campos de subtotales y totales 
    .ele(createGTotSub(cabecera)).up()
    .up()//DE
    .ele(createGCamFuFD(carQRValue)).up()
  
  // Return the XML as a string
  return xml.end({ pretty: true });
};

const formatDateToISO = (date) => {
  const dateObj = new Date(date);
  return dateObj.toISOString().split('.')[0]; // Elimina los milisegundos
};

const createGCamFuFD = (carQR) => {
  return {
    gCamFuFD: {
      dCarQR: carQR
    }
  };
};
const createGTotSub = (cabecera) => {
  return {
    gTotSub: {
      dSubExe: "0",
      dSubExo: "0",
      dSub5: "0",
      dSub10: cabecera.importeTotal,
      dTotOpe: cabecera.importeTotal,
      dTotDesc: "0",
      dTotDescGlotem: "0",
      dTotAntItem: "0",
      dTotAnt: "0",
      dPorcDescTotal: "0",
      dDescTotal: "0",
      dAnticipo: "0",
      dRedon: "0",
      dTotGralOpe: cabecera.importeTotal,
      dIVA5: cabecera.importeIva5,
      dIVA10: cabecera.importeIva10,
      dLiqTotIVA5: "0",
      dLiqTotIVA10: "0",
      dTotIVA: cabecera.importeIva10 + cabecera.importeIva5 + cabecera.importeIvaExenta,
      dBaseGrav5: "0",
      dBaseGrav10: "0",
      dTBasGraIVA: "0"
    }
  };
};

const createGCamItem = (item) => {
  return {
    gCamItem: {
      dCodInt: item.variante.codErp,
      dDesProSer: `${item.producto.nombre} ${item.presentacion.descripcion} ${item.variedad.descripcion} ${item.unidad.code}`,
      cUniMed: "77", // Asegúrate de que este código sea el correcto
      dDesUniMed: "UNI", // Asegúrate de que esta descripción sea la correcta
      dCantProSer: item.cantidad,
      gValorItem: {
        dPUniProSer: (item.importeTotal / item.cantidad), // Ajusta el número de decimales según sea necesario
        dTotBruOpeItem: item.importeTotal,
        gValorRestaItem: {
          dDescItem: "0",
          dPorcDesIt: "0",
          dDescGloItem: "0",
          dAntPreUniIt: "0",
          dAntGloPreUniIt: "0",
          dTotOpeItem: item.importeTotal
        }
      },
      gCamIVA: {
        iAfecIVA: "1",
        dDesAfecIVA: "Gravado IVA",
        dPropIVA: "100",
        dTasaIVA: "10",
        dBasGravIVA: item.importeNeto, // Ajusta el número de decimales según sea necesario
        dLiqIVAItem: item.importeIva10, // Ajusta el número de decimales según sea necesario
        dBasExe: "0"
      }
    }
  };
};

const createGCamCond = (formaVenta, importeTotal) => {
  if (formaVenta.id == 1) {
    // Contado
    return {
      gCamCond: {
        iCondOpe: "1",
        dDCondOpe: "Contado",
        gPaConEIni: {
          iTiPago: "1",
          dDesTiPag: "Efectivo",
          dMonTiPag: importeTotal,
          cMoneTiPag: "PYG",
          dDMoneTiPag: "Guarani"
        }
      }
    };
  } else {
    // Crédito
    return {
      gCamCond: {
        iCondOpe: "2",
        dDCondOpe: "Crédito",
        gPagCred: {
          iCondCred: "1",
          dDCondCred: "Plazo",
          dPlazoCre: `${formaVenta.dias} dias`
        }
      }
    };
  }
};

const createGCamFE = () => {
  return {
   
      gCamFE: {
        iIndPres: "1",
        dDesIndPres: "Operación presencial"
      }
 
  };
};
const createGDatRec = (cabecera) => {
  const [dRucRec, dDVRec] = cabecera.cliente.nroDocumento.split("-");
  const iNatRec = cabecera.cliente.nroDocumento.includes("-") ? 1 : 2; // 1= contribuyente, 2= no contribuyente
  const iTiOpe = cabecera.cliente.nroDocumento.includes("-") ? 1 : 2;

  if (iNatRec === 1) { // Contribuyente
    return {
      gDatRec: {
        iNatRec: iNatRec,
        iTiOpe: iTiOpe,
        cPaisRec: "PRY",
        dDesPaisRe: "Paraguay",
        iTiContRec: "2",
        dRucRec: dRucRec,
        dDVRec: dDVRec,
        dNomRec: cabecera.cliente.razonSocial,
        dDirRec: cabecera.cliente.direccion,
        dNumCasRec: "0"
      }
    };
  } else { // No contribuyente
    return {
      gDatRec: {
        iNatRec: iNatRec,
        iTiOpe: iTiOpe,
        cPaisRec: "PRY",
        dDesPaisRe: "Paraguay",
        iTipIDRec: "1",
        dDTipIDRec: "Cédula paraguaya",
        dNumIDRec: cabecera.cliente.nroDocumento,
        dNomRec: cabecera.cliente.razonSocial,
        dDirRec: cabecera.cliente.direccion,
        dNumCasRec: "0"
      }
    };
  }
};
const createGEmis = (cabecera, tipoContribuyente, departamento, distrito, ciudad) => {
  const [nroDocumentoEmp, digitoEmpr] = cabecera.empresa.ruc.split("-");
  const emisElement = {
    gEmis: {
      dRucEm: nroDocumentoEmp,
      dDVEmi: digitoEmpr,
      iTipCont: tipoContribuyente.codigo,
      dNomEmi: cabecera.empresa.razonSocial,
      dNomFanEmi: cabecera.empresa.nombreFantasia,
      dDirEmi: cabecera.sucursal.direccion,
      dNumCas: cabecera.empresa.numCasa,
      cDepEmi: departamento.codigo,
      dDesDepEmi: departamento.descripcion,
      cDisEmi: distrito.codigo,
      dDesDisEmi: distrito.descripcion,
      cCiuEmi: ciudad.codigo,
      dDesCiuEmi: ciudad.descripcion,
      dTelEmi: cabecera.empresa.telefono,
      dEmailE: cabecera.empresa.email
    }
  };
  
  // Añadir actividades económicas si existen
  if (cabecera.empresa.actividadcode1) {
    emisElement.gEmis.gActEco = [
      {
        cActEco: cabecera.empresa.actividadcode1,
        dDesActEco: cabecera.empresa.actividad1
      }
    ];
  }
  
  if (cabecera.empresa.actividadcode2) {
    emisElement.gEmis.gActEco = emisElement.gEmis.gActEco || [];
    emisElement.gEmis.gActEco.push({
      cActEco: cabecera.empresa.actividadcode2,
      dDesActEco: cabecera.empresa.actividad2
    });
  }
  
  if (cabecera.empresa.actividadcode3) {
    emisElement.gEmis.gActEco = emisElement.gEmis.gActEco || [];
    emisElement.gEmis.gActEco.push({
      cActEco: cabecera.empresa.actividadcode3,
      dDesActEco: cabecera.empresa.actividad3
    });
  }

  return emisElement;
};
const createGOpeCom = (tipoTransacciones, tipoImpuesto,moneda) => {
  return {
    gOpeCom: {
      iTipTra: tipoTransacciones.codigo,
      dDesTipTra: tipoTransacciones.descripcion,
      dDesTipTra: tipoTransacciones.descripcion,

      iTImp: tipoImpuesto.codigo,
      cMoneOpe: moneda.codigo,
      dDesMoneOpe: moneda.descripcion,
    }
  };
};

const createGOpeDE = (tipoEmision, cabecera) => {
  return {
    gOpeDE: {
      iTipEmi: tipoEmision.codigo,
      dDesTipEmi: tipoEmision.descripcion,
      dCodSeg: cabecera.codigoSeguridad,
    }
  };
};
const createGTimb = (cabecera, establecimiento, puntoExp, numero) => {
  return {
    gTimb: {
      iTiDE: cabecera.tipoDocumento.codigo,
      dDesTiDE: cabecera.tipoDocumento.descripcion,
      dNumTim: cabecera.timbrado,
      dEst: establecimiento,
      dPunExp: puntoExp,
      dNumDoc: numero,
      dFeIniT: cabecera.fechaInicio,
    }
  };
};
module.exports = {
  generaXML
};
