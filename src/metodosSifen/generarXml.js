const xmlbuilder = require("xmlbuilder");
const VentaXml = require("../models/ventaXml.model");
const fs = require("fs"); 
const { generateDatosItemsOperacion } = require("./service/generateDteItem.service");
const { generateDatosTotales } = require("./service/generateDteTotales.service");
const { signXML } = require("./service/signxml.service"); 
const { generateQR } = require("./service/generateQR.service");
const { normalizeXML } = require("./service/util");
const { crearVentaXml } = require("../controllers/ventaXml-controller");
 
const generarXML = async (empresa, venta) => {
   
  try {
    const tipoEmision = {codigo: 1, descripcion: "Normal"};
    const [establecimiento, puntoExp, numero] = venta.nroComprobante.split("-");
    const fechaActualISO = formatDateToLocalISO(new Date());
    const fechaEmisionISO = formatDateToISO(venta.fechaCreacion);
    const sifenData = {
      tipoImpuesto: empresa.tipoImpId,
      tipoDocumento: venta.itide,
      tipoOperacion: venta.cliente.nroDocumento.includes("-") ? 1 : 2,
      anticipoGlobal: 0,
      comision: 0,
      condicionTipoCambio: 1,
      cambio: 0,
      moneda: empresa.codMoneda,
      descuentoGlobal: venta.importeDescuento,
      importeSubtotal: venta.importeSubtotal,
      importeTotal: venta.importeTotal
    };
 
    const sifenDetalles = await generateDatosItemsOperacion(
      sifenData,
      venta.detalles
    );
    const sifenCab = await generateDatosTotales(sifenData, sifenDetalles.gCamItem);
    let xml = xmlbuilder
      .create("rDE", { version: "1.0", encoding: "UTF-8" })
      .att("xmlns", "http://ekuatia.set.gov.py/sifen/xsd")
      .att("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
      .att(
        "xsi:schemaLocation",
        "http://ekuatia.set.gov.py/sifen/xsd siRecepDE_v150.xsd"
      )
      // Header data
      .ele("dVerFor", process.env.EKUATIA_VERSION)
      .up()
      .ele("DE", { Id: venta.cdc })
      .ele("dDVId", venta.cdc.charAt(venta.cdc.length - 1))
      .up()
      /*
        La fecha y hora de la firma digital debe ser anterior a la fecha y hora de transmisión al SIFEN
      El certificado digital debe estar vigente al momento de la firma digital del DE Fecha y hora en el formato AAAA-MM-DDThh:mm:ss
      El plazo límite de transmisión del DE al SIFEN para la aprobación normal es de 72 h contadas a partir de la fecha y hora de la firma digital
    */
      .ele("dFecFirma", fechaActualISO)
      .up()
      .ele("dSisFact", "1")
      .up()
      // Operation data
      .ele(createGOpeDE(tipoEmision, venta.codigoSeguridad))
      .up() // Uso de la función modularizada para gOpeDE
      .ele(createGTimb(venta, establecimiento, puntoExp, numero))
      .up() // Uso de la función modularizada
      // Campos generales del DE
      .ele("gDatGralOpe")
      /* Fecha y hora en el formato AAAA-MM-DDThh:mm:ss Para el KuDE el formato de la fecha de emisión debe contener los guiones separadores. Ejemplo: 2018-05-31T12:00:00
          Se aceptará como límites técnicos del sistema, que la fecha de emisión del DE sea atrasada hasta 720 horas (30 días) y adelantada hasta
          120 horas (5 días) en relación a la fecha y hora de transmisión al SIFEN
        */
      .ele("dFeEmiDE", fechaEmisionISO)
      .up()
      //Campos inherentes a la operación comercial
      .ele(createGOpeCom(empresa))
      .up()
      //Grupo de campos que identifican al emisor
      .ele(
        createGEmis(empresa, venta.sucursal)
      )
      .up()
      //Grupo de campos que identifican al receptor
      .ele(createGDatRec(venta))
      .up() // Uso de la función modularizada para gDatRec
      .up() //cierre gDatGralOpe
      // Campos específicos por tipo de Documento Electrónico
      .ele("gDtipDE")
      .ele(createGCamFE())
      .up() //Campos que componen la FE
      //Campos que describen la condición de la operación
      .ele(createGCamCond(venta.formaVenta, roundTo8Decimals(venta.importeTotal)))
      .up()
      //Campos que describen los ítems de la operación
     // .ele(venta.detalles.map(item => createGCamItem(item)))
     .ele( sifenDetalles) 
     .up()
      .up()
      //Campos de subtotales y totales
     // .ele(createGTotSub(venta))
     .ele(sifenCab)
      .up()
      .up() //DE
      .ele(createGCamFuFD())
      .up();
  
    // Return the XML as a string
    let xmlBase = xml.end({ pretty: false });
    xmlBase =    normalizeXML(xmlBase);          
    xmlBase = xmlBase.replace('<?xml version="1.0" encoding="UTF-8"?>', "")
    
    await crearVentaXml(empresa.id, venta.id, xmlBase, 1, "GENERADO");

    const xmlFirmado =await signXML(xmlBase,empresa.certificado)
    
    const xmlFirmadoConQr =await generateQR(xmlFirmado,  empresa.idCSC,  empresa.csc);
    console.log('Este es el xml xmlFirmadoConQr =>',xmlFirmadoConQr)
 
    await crearVentaXml(empresa.id, venta.id, xmlFirmadoConQr, 2, "FIRMADO");

  
   // if (xmlFirmadoConQr)  fs.writeFileSync(`./xmlfirmado_${venta.cdc}.xml`, xmlFirmadoConQr);

  return xmlFirmadoConQr;
    
  } catch (error) {
    console.error(error)
    console.error(JSON.stringify(error, null, 2)); 

    await crearVentaXml(empresa.id, venta.id, JSON.stringify(error, Object.getOwnPropertyNames(error)), 0, "ERROR");
 
    return null;
  }
};

const formatDateToISO = date => {
  const dateObj = new Date(date);
  return dateObj.toISOString().split(".")[0]; // Elimina los milisegundos
};

const createGCamFuFD = () => {
  return {
    gCamFuFD: {
      dCarQR: "****************************************************************************************************"
    }
  };
};
const createGTotSub = (venta) => {
  const dTotIVA =  Number(venta.importeIva10) + Number(venta.importeIva5);
  const dBaseGrav5 =(venta.importeIva5 > 0)  ? (venta.importeTotal - venta.importeIva5)  : 0;
  const dBaseGrav10 =(venta.importeIva10 > 0)  ? (venta.importeTotal - venta.importeIva10)  : 0;
  const dTBasGraIVA =(venta.importeIva5 > 0 || venta.importeIva10 > 0)  ? (venta.importeTotal - dTotIVA  )  : 0;
/*   console.log('dTotIVA',dTotIVA)
  console.log('dBaseGrav5',dBaseGrav5)
  console.log('dBaseGrav10',dBaseGrav10)
  console.log('dTBasGraIVA',dTBasGraIVA) */
  return {
    gTotSub: {
      dSubExe: "0",
      dSubExo: "0",
      dSub5: "0",
      dSub10: venta.importeTotal,
      dTotOpe: venta.importeTotal,
      dTotDesc: "0",
      dTotDescGlotem: "0",
      dTotAntItem: "0",
      dTotAnt: "0",
      dPorcDescTotal: "0",
      dDescTotal: "0",
      dAnticipo: "0",
      dRedon: "0",
      dTotGralOpe: venta.importeTotal,
      dIVA5: roundTo8Decimals(venta.importeIva5),
      dIVA10: roundTo8Decimals(venta.importeIva10),
      dLiqTotIVA5: "0",
      dLiqTotIVA10: "0",
      dTotIVA: roundTo8Decimals(dTotIVA),
      dBaseGrav5:roundTo8Decimals(dBaseGrav5),
      dBaseGrav10: roundTo8Decimals(dBaseGrav10),
      dTBasGraIVA: roundTo8Decimals(dTBasGraIVA) 
    }
  };
};

const createGCamItem = (item) => {
  //console.log(item)
  return {
    gCamItem: {
      dCodInt: item.variante.codErp,
      dDesProSer: `${item.producto.nombre} ${item.presentacion
        .descripcion} ${item.variedad.descripcion} ${item.unidad.code}`,
      cUniMed: "77", // Asegúrate de que este código sea el correcto
      dDesUniMed: "UNI", // Asegúrate de que esta descripción sea la correcta
      dCantProSer: item.cantidad,
      gValorItem: {
        dPUniProSer: item.importePrecio, // Ajusta el número de decimales según sea necesario
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
        dBasGravIVA: roundTo8Decimals(item.importeIva10 * item.cantidad), // Ajusta el número de decimales según sea necesario
        dLiqIVAItem: roundTo8Decimals(item.importeIva10), // Ajusta el número de decimales según sea necesario
        dBasExe: "0"
      }
    }
  };
};
const roundTo8Decimals = (value) => {  
  const numValue = Number(value);  // Convertir a número
  if (isNaN(numValue)) {
    console.error('❌ Error: Valor no numérico en roundTo8Decimals:'+ value+" se cambia a 0");
    return 0;  // Retorna 0 en caso de error
  }
  //console.log('roundTo8Decimals', numValue);
  return parseFloat(numValue.toFixed(8)); // Redondea a 8 decimales
};
const formatDateToLocalISO =(date)=> {
  const tzOffset = -date.getTimezoneOffset(); // Diferencia en minutos entre UTC y tu zona horaria
  const offsetHours = Math.floor(tzOffset / 60);
  const offsetMinutes = tzOffset % 60;

  const localDate = new Date(date.getTime() + tzOffset * 60000);
  const isoString = localDate.toISOString();

  // Agregar el offset en formato ±HH:MM
  const sign = tzOffset >= 0 ? "+" : "-";
  const formattedOffset =
    sign +
    String(Math.abs(offsetHours)).padStart(2, "0") +
    ":" +
    String(Math.abs(offsetMinutes)).padStart(2, "0");

  return isoString.replace("Z", formattedOffset).substring(0, 19);
}
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
const createGDatRec = (venta) => {
  const [dRucRec, dDVRec] = venta.cliente.nroDocumento.split("-");
  const iTiOpe = venta.cliente.tipoOperacionId;
  /*1 = B2B (Business to Business)  
  2 = B2C (Business to Consumer)  
  3 = B2G (Business to Government)  
  4 = B2F (Business to Freelancer o servicios a empresas o profesionales)  */
  const iNatRec = (iTiOpe == 1) ? 1 : 2; // 1= contribuyente, 2= no contribuyente
/**
 * iTiOpe
1= B2B
2= B2C
3= B2G
4= B2F
 * 
 */

  if (iNatRec === 1) {
    // Contribuyente
    return {
      gDatRec: {
        iNatRec: iNatRec,
        iTiOpe: iTiOpe,
        cPaisRec: "PRY",
        dDesPaisRe: "Paraguay",
        iTiContRec: "2",
        dRucRec: dRucRec,
        dDVRec: dDVRec,
        dNomRec: venta.cliente.razonSocial,
        dDirRec: venta.cliente.direccion,
        dNumCasRec: "0"
      }
    };
  } else {
    // No contribuyente
    return {
      gDatRec: {
        iNatRec: iNatRec,
        iTiOpe: iTiOpe,
        cPaisRec: "PRY",
        dDesPaisRe: "Paraguay",
        iTipIDRec: "1",
        dDTipIDRec: "Cédula paraguaya",
        dNumIDRec: venta.cliente.nroDocumento,
        dNomRec: venta.cliente.razonSocial,
        dDirRec: venta.cliente.direccion,
        dNumCasRec: "0"
      }
    };
  }
};
const createGEmis = (
  empresa ,sucursal
) => {
  const [nroDocumentoEmp, digitoEmpr] = empresa.ruc.split("-");
  const emisElement = {
    gEmis: {
      dRucEm: nroDocumentoEmp,
      dDVEmi: digitoEmpr,
      iTipCont: empresa.tipoContribuyente.codigo,
      dNomEmi:  empresa.razonSocial,
      dNomFanEmi:  empresa.nombreFantasia,
      dDirEmi:  sucursal.direccion,
      dNumCas:  empresa.numCasa,
      cDepEmi: empresa.departamento.codigo,
      dDesDepEmi: empresa.departamento.descripcion,
      cDisEmi: empresa.ciudad.codigo,
      dDesDisEmi: empresa.ciudad.descripcion,
      cCiuEmi: empresa.barrio.codigo,
      dDesCiuEmi: empresa.barrio.descripcion,
      dTelEmi: empresa.telefono,
      dEmailE: empresa.email,
      dDenSuc: 1, // falta agregar,
      gActEco: Array.isArray(empresa.actividades) ? [...empresa.actividades] : [],
    }
  };
 

  return emisElement;
};
const createGOpeCom = (empresa) => {
  return {
    gOpeCom: {
      iTipTra: empresa.tipoTransaccion.codigo,
      dDesTipTra: empresa.tipoTransaccion.descripcion, 

      iTImp: empresa.tipoImpuesto.codigo,
      dDesTImp: empresa.tipoImpuesto.descripcion,
      cMoneOpe: empresa.moneda.codigo,
      dDesMoneOpe: empresa.moneda.descripcion
    }
  };
};

const createGOpeDE = (tipoEmision, codigoSeguridad) => {
  return {
    gOpeDE: {
      iTipEmi: tipoEmision.codigo,
      dDesTipEmi: tipoEmision.descripcion,
      dCodSeg: codigoSeguridad
    }
  };
};
const createGTimb = (venta, establecimiento, puntoExp, numero) => {
  return {
    gTimb: {
      iTiDE: venta.tipoDocumento.codigo,
      dDesTiDE: venta.tipoDocumento.descripcion,
      dNumTim: venta.timbrado,
      dEst: establecimiento,
      dPunExp: puntoExp,
      dNumDoc: numero,
      dFeIniT: venta.fechaInicio
    }
  };
};
module.exports = {
  generarXML, 
  formatDateToLocalISO, 
};
