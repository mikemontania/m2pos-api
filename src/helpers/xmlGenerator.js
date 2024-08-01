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
  const [nroDocumentoEmp, digitoEmpr] = cabecera.empresa.ruc.split("-");
  const [establecimiento, puntoExp, numero] = cabecera.nroComprobante.split(    "-"  );
  const [dRucRec, dDVRec] = cabecera.cliente.nroDocumento.split("-");
  const iNatRec = cabecera.cliente.nroDocumento.includes("-") ? 1 : 2; //1= contribuyente  2= no contribuyente
  const iTiOpe = cabecera.cliente.nroDocumento.includes("-") ? 1 : 2; //
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
.ele("dVerFor", "150").up()
.ele("DE", { Id: cabecera.cdc })
  .ele("dDVId", cabecera.cdc.charAt(cabecera.cdc.length - 1)).up()
  .ele("dFecFirma", "2024-07-25T20:30:40").up()
  .ele("dSisFact", "1").up()

  // Operation data
  .ele("gOpeDE")
    .ele("iTipEmi", tipoEmision.codigo).up()
    .ele("dDesTipEmi", tipoEmision.descripcion).up()
    .ele("dCodSeg", cabecera.codigoSeguridad).up()
  .up()
  .ele("gTimb")
    .ele("iTiDE", cabecera.tipoDocumento.codigo).up()
    .ele("dDesTiDE", cabecera.tipoDocumento.descripcion).up()
    .ele("dNumTim", cabecera.timbrado).up()
    .ele("dEst", establecimiento).up()
    .ele("dPunExp", puntoExp).up()
    .ele("dNumDoc", numero).up()
    .ele("dFeIniT", cabecera.fechaInicio).up()
  .up()
    // General operation data
    .ele("gDatGralOpe")
      .ele("dFeEmiDE", cabecera.fechaCreacion).up()
      .ele("gOpeCom")
        .ele("iTipTra", tipoTransacciones.codigo).up()
        .ele("dDesTipTra", tipoTransacciones.descripcion).up()
        .ele("iTImp", tipoImpuesto.codigo).up()
        .ele("dDesTImp", tipoImpuesto.descripcion).up()
        .ele("cMoneOpe", moneda.codigo).up()
        .ele("dDesMoneOpe", moneda.descripcion).up()
      .up()
      // Emitter data
      let emisElement = xml
      .ele("gEmis")
      .ele("dRucEm", nroDocumentoEmp).up()
      .ele("dDVEmi", digitoEmpr).up()
      .ele("iTipCont", tipoContribuyente.codigo).up()
      .ele("dNomEmi", cabecera.empresa.razonSocial).up()
      .ele("dNomFanEmi", cabecera.empresa.nombreFantasia).up()
      .ele("dDirEmi", cabecera.sucursal.direccion).up()
      .ele("dNumCas", cabecera.empresa.numCasa).up()
      .ele("cDepEmi", departamento.codigo).up()
      .ele("dDesDepEmi", departamento.descripcion).up()
      .ele("cDisEmi", distrito.codigo).up()
      .ele("dDesDisEmi", distrito.descripcion).up()
      .ele("cCiuEmi", ciudad.codigo).up()
      .ele("dDesCiuEmi", ciudad.descripcion).up()
      .ele("dTelEmi", cabecera.empresa.telefono).up()
      .ele("dEmailE", cabecera.empresa.email).up();
  
  if (cabecera.empresa.actividadcode1) {
      emisElement.ele("gActEco")
          .ele("cActEco", cabecera.empresa.actividadcode1).up()
          .ele("dDesActEco", cabecera.empresa.actividad1).up()
      .up();
  }
  
  if (cabecera.empresa.actividadcode2) {
      emisElement.ele("gActEco")
          .ele("cActEco", cabecera.empresa.actividadcode2).up()
          .ele("dDesActEco", cabecera.empresa.actividad2).up()
      .up();
  }
  
  if (cabecera.empresa.actividadcode3) {
      emisElement.ele("gActEco")
          .ele("cActEco", cabecera.empresa.actividadcode3).up()
          .ele("dDesActEco", cabecera.empresa.actividad3).up()
      .up();
  }
  
  // Cierra el elemento gEmis
  emisElement.up();
  if (iNatRec == 1) {
    // Contribuyente
    xml.ele("gDatRec")
      .ele("iNatRec", iNatRec).up()
      .ele("iTiOpe", iTiOpe).up()
      .ele("cPaisRec", "PRY").up()
      .ele("dDesPaisRe", "Paraguay").up()
      .ele("iTiContRec", "2").up()
      .ele("dRucRec", dRucRec).up()
      .ele("dDVRec", dDVRec).up()
      .ele("dNomRec", cabecera.cliente.razonSocial).up()
      .ele("dDirRec", cabecera.cliente.direccion).up()
      .ele("dNumCasRec", "0").up()
    .up();
  } else {
    // No contribuyente
    xml.ele("gDatRec")
    .ele("iNatRec", iNatRec).up()
      .ele("iTiOpe", iTiOpe).up()
      .ele("cPaisRec", "PRY").up()
      .ele("dDesPaisRe", "Paraguay").up()
      .ele("iTipIDRec", "1").up()
      .ele("dDTipIDRec", "Cédula paraguaya").up()
      .ele("dNumIDRec", cabecera.cliente.nroDocumento).up()
      .ele("dNomRec", cabecera.cliente.razonSocial).up()
      .ele("dDirRec", cabecera.cliente.direccion).up()
      .ele("dNumCasRec", "0").up()
    .up();
 
  }
  xml.up().up();
 
  // Continuación de la estructura XML
  xml
    .ele("gDtipDE")
    .ele("gCamFE")
    .ele("iIndPres", "1")
    .up()
    .ele("dDesIndPres", "Operación presencial")
    .up()
    .up()


    if (cabecera.formaVenta.id == 1) {
      // Contado
      xml
        .ele("gCamCond")
        .ele("iCondOpe", "1")
        .up()
        .ele("dDCondOpe", "Contado")
        .up()
        .ele("gPaConEIni")
        .ele("iTiPago", "1")
        .up()
        .ele("dDesTiPag", "Efectivo")
        .up()
        .ele("dMonTiPag", cabecera.importeTotal)
        .up()
        .ele("cMoneTiPag", "PYG")
        .up()
        .ele("dDMoneTiPag", "Guarani")
        .up()
        .up() // Cerrar gPaConEIni
        .up(); // Cerrar gCamCond
    } else {
      // Crédito
      xml
        .ele("gCamCond")
        .ele("iCondOpe", "2")
        .up()
        .ele("dDCondOpe", "Crédito")
        .up()
        .ele("gPagCred")
        .ele("iCondCred", "1")
        .up()
        .ele("dDCondCred", "Plazo")
        .up()
        .ele("dPlazoCre", cabecera.formaVenta.dias + " dias")
        .up()
        .up() // Cerrar gPagCred
        .up(); // Cerrar gCamCond
    }

detalles.forEach(item => {
  xml
  .ele("gCamItem")
    .ele("dCodInt", item.variante.codErp).up()
    .ele("dDesProSer", item.producto.nombre+" "+item.presentacion.descripcion+" "+item.variedad.descripcion+" "+item.unidad.code).up()
    .ele("cUniMed", "77").up()
    .ele("dDesUniMed", "UNI").up()
    .ele("dCantProSer", item.cantidad).up()
    .ele("gValorItem")
      .ele("dPUniProSer",(item.importeTotal/item.cantidad) ).up()
      .ele("dTotBruOpeItem",item.importeTotal).up()
      .ele("gValorRestaItem")
        .ele("dDescItem", "0").up()
        .ele("dPorcDesIt", "0").up()
        .ele("dDescGloItem", "0").up()
        .ele("dAntPreUniIt", "0").up()
        .ele("dAntGloPreUniIt", "0").up()
        .ele("dTotOpeItem", item.importeTotal).up()
      .up()
    .up()
    .ele("gCamIVA")
      .ele("iAfecIVA", "1").up()
      .ele("dDesAfecIVA", "Gravado IVA").up()
      .ele("dPropIVA", "100").up()
      .ele("dTasaIVA", "10").up()
      .ele("dBasGravIVA",item.importeNeto).up()
      .ele("dLiqIVAItem",item.importeIva10).up()
      .ele("dBasExe", "0").up()
    .up()
  .up()

});

    xml.ele("gTotSub")
    .ele("dSubExe", "0").up()
    .ele("dSubExo", "0").up()
    .ele("dSub5", "0").up()
    .ele("dSub10", cabecera.importeTotal).up()
    .ele("dTotOpe", cabecera.importeTotal).up()
    .ele("dTotDesc", 0).up()
    .ele("dTotDescGlotem", 0).up()
    .ele("dTotAntItem", 0).up()
    .ele("dTotAnt", 0).up()
    .ele("dPorcDescTotal", 0).up()
    .ele("dDescTotal", 0).up()
    .ele("dAnticipo", 0).up()
    .ele("dRedon", 0).up()
    .ele("dTotGralOpe",cabecera.importeTotal).up()
    .ele("dIVA5",  cabecera.importeIva5).up()
    .ele("dIVA10", cabecera.importeIva10).up()
    .ele("dLiqTotIVA5", 0).up()
    .ele("dLiqTotIVA10", 0).up()
    .ele("dTotIVA",cabecera.importeIva10 +cabecera.importeIva5 +cabecera.importeIvaExenta ).up()
    .ele("dBaseGrav5", 0)
    .ele("dBaseGrav10", 0)
    .ele("dTBasGraIVA", 0)
    .up()
    .up()
    .up();
  // Return the XML as a string
  return xml.end({ pretty: true });
};

module.exports = {
  generaXML
};
