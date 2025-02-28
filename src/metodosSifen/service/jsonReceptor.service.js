const {
  paises,
  tiposDocumentosReceptorInnominado,
  departamentos,
  distritos,
  ciudades,
  tiposTransacciones,
  tiposImpuestos,
  monedas,
  obligaciones
} = require("../../constantes/Constante.constant");
const { defaultConfig } = require("./config");
const {
  globalPorItem,
  tiposDocumentosIdentidades,
  indicadoresPresencias,
  naturalezaVendedorAutofactura,
  notasCreditosMotivos,
  remisionesMotivos,
  remisionesResponsables,
  condicionesOperaciones,
  condicionesCreditosTipos
} = require("./constants.service");

const generateDatosGeneralesReceptorDE = data => {
  json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"] = {
    iNatRec: data["cliente"]["contribuyente"] ? 1 : 2,
    iTiOpe: +data["cliente"]["tipoOperacion"],
    cPaisRec: data["cliente"]["pais"],
    dDesPaisRe: paises.filter(
      pais => pais.codigo === data["cliente"]["pais"]
    )[0]["descripcion"]
  };

  if (data["cliente"]["contribuyente"]) {
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["iTiContRec"] =
      data["cliente"]["tipoContribuyente"];
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dRucRec"] = (data["cliente"][
      "ruc"
    ].split("-")[0] + "").trim();
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dDVRec"] = (data["cliente"][
      "ruc"
    ].split("-")[1] + "").trim();
  }

  //if (!data['cliente']['contribuyente'] && data['cliente']['tipoOperacion']) { 2024-09-03
  if (!data["cliente"]["contribuyente"]) {
    //Obligatorio completar D210

    if (data["cliente"]["documentoTipo"]) {
      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["iTipIDRec"] = +data[
        "cliente"
      ]["documentoTipo"];
      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"][
        "dDTipIDRec"
      ] = tiposDocumentosReceptorInnominado.filter(
        tdr => tdr.codigo === +data["cliente"]["documentoTipo"]
      )[0]["descripcion"];
    }

    if (+data["cliente"]["documentoTipo"] == 9) {
      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dDTipIDRec"] =
        data["cliente"]["documentoTipoDescripcion"];
    }

    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dNumIDRec"] = (data["cliente"][
      "documentoNumero"
    ] + "").trim();

    if (+data["cliente"]["documentoTipo"] === 5) {
      //Si es innominado completar con cero
      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dNumIDRec"] = "0";
      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dNomRec"] = "Sin Nombre";
    }
  }

  json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dNomRec"] = data["cliente"][
    "razonSocial"
  ].trim();

  if (data["cliente"]["nombreFantasia"]) {
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dNomFanRec"] = data["cliente"][
      "nombreFantasia"
    ].trim();
  }

  if (data["cliente"]["direccion"]) {
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dDirRec"] = data["cliente"][
      "direccion"
    ].trim();
  }

  if (data["cliente"]["numeroCasa"]) {
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dNumCasRec"] = (data[
      "cliente"
    ]["numeroCasa"] + "").trim();
  }

  //
  if (data["cliente"]["direccion"] && +data["cliente"]["tipoOperacion"] != 4) {
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["cDepRec"] = +data["cliente"][
      "departamento"
    ];
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"][
      "dDesDepRec"
    ] = departamentos.filter(
      td => td.codigo === +data["cliente"]["departamento"]
    )[0]["descripcion"];
  }

  if (data["cliente"]["direccion"] && +data["cliente"]["tipoOperacion"] != 4) {
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["cDisRec"] = +data["cliente"][
      "distrito"
    ];
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"][
      "dDesDisRec"
    ] = distritos.filter(td => td.codigo === +data["cliente"]["distrito"])[0][
      "descripcion"
    ];
  }

  if (data["cliente"]["direccion"] && +data["cliente"]["tipoOperacion"] != 4) {
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["cCiuRec"] = +data["cliente"][
      "ciudad"
    ];
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dDesCiuRec"] = ciudades.filter(
      td => td.codigo === +data["cliente"]["ciudad"]
    )[0]["descripcion"];
  }

  //Asignar null a departamento, distrito y ciudad si tipoOperacion = 4

  if (data["cliente"]["telefono"]) {
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"].dTelRec = (data["cliente"][
      "telefono"
    ] + "").trim();
  }
  if (data["cliente"]["celular"]) {
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"].dCelRec = (data["cliente"][
      "celular"
    ] + "").trim();
  }
  if (data["cliente"]["email"]) {
    let email = new String(data["cliente"]["email"]); //Hace una copia, para no alterar.

    //Verificar si tiene varios correos.
    if (email.indexOf(",") > -1) {
      //Si el Email tiene , (coma) entonces va enviar solo el primer valor, ya que la SET no acepta Comas
      email = email.split(",")[0].trim();
    }

    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"].dEmailRec = email.trim();
  }

  if (data["cliente"]["codigo"]) {
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dCodCliente"] = (data[
      "cliente"
    ]["codigo"] + "").trim();
  }
};

const generateDatosGeneralesInherentesOperacion = data => {
  if (data["tipoDocumento"] == 7) {
    //C002
    return; //No informa si el tipo de documento es 7
  }

  let moneda = data["moneda"];

  if (!moneda && defaultConfig.defaultValues === true) {
    moneda = "PYG";
  }

  json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"] = {};

  if (data["tipoDocumento"] == 1 || data["tipoDocumento"] == 4) {
    //Obligatorio informar iTipTra D011
    if (!data["tipoTransaccion"]) {
      //throw new Error('Debe proveer el Tipo de Transacción en data.tipoTransaccion');
    }
    json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"]["iTipTra"] =
      data["tipoTransaccion"];
    json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"][
      "dDesTipTra"
    ] = tiposTransacciones.filter(
      tt => tt.codigo == data["tipoTransaccion"]
    )[0]["descripcion"];
  }

  json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"]["iTImp"] = data["tipoImpuesto"]; //D013
  json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"][
    "dDesTImp"
  ] = tiposImpuestos.filter(ti => ti.codigo == data["tipoImpuesto"])[0][
    "descripcion"
  ]; //D013
  json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"]["cMoneOpe"] = moneda; //D015
  json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"]["dDesMoneOpe"] = monedas.filter(
    m => m.codigo == moneda
  )[0]["descripcion"];

  if (moneda != "PYG") {
    if (!data["condicionTipoCambio"]) {
      //throw new Error('Debe informar el tipo de Cambio en data.condicionTipoCambio');
    }
    //Obligatorio informar dCondTiCam D017
    json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"]["dCondTiCam"] =
      data["condicionTipoCambio"];
  }
  if (data["condicionTipoCambio"] == 1 && moneda != "PYG") {
    if (!(data["cambio"] && data["cambio"] > 0)) {
      //throw new Error('Debe informar el valor del Cambio en data.cambio');
    }
    //Obligatorio informar dCondTiCam D018
    json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"]["dTiCam"] = data["cambio"];
  }

  if (data["condicionAnticipo"]) {
    json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"]["iCondAnt"] =
      data["condicionAnticipo"];
    json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"]["dDesCondAnt"] =
      "Anticipo " +
      globalPorItem.filter(ca => ca.codigo == data["condicionAnticipo"])[0][
        "descripcion"
      ];
  }

  if (data["obligaciones"] && Array.isArray(data["obligaciones"])) {
    let gOblAfe = new Array();
    for (let i = 0; i < data["obligaciones"].length; i++) {
      let gOblAfeItem = {};
      gOblAfeItem["cOblAfe"] = data["obligaciones"][i]["codigo"];
      //gOblAfeItem['dDesOblAfe'] = params['obligaciones'][i]['descripcion'];
      gOblAfeItem["dDesOblAfe"] = obligaciones.filter(
        ca => ca.codigo == +data["obligaciones"][i]["codigo"]
      )[0]["descripcion"];
      gOblAfe.push(gOblAfeItem);
    }

    json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"]["gOblAfe"] = gOblAfe;
  }
};
const generateDatosGeneralesEmisorDE = (params, data) => {
  let establecimiento = leftZero(data["establecimiento"], 3);

  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"] = {};
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dRucEm"] = params["ruc"].split(
    "-"
  )[0];
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dDVEmi"] = params["ruc"].split(
    "-"
  )[1];
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["iTipCont"] =
    params["tipoContribuyente"];
  if (typeof params["tipoRegimen"] != undefined) {
    json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["cTipReg"] =
      params["tipoRegimen"];
  }
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dNomEmi"] = params["razonSocial"];
  if (params["nombreFantasia"] && (params["nombreFantasia"] + "").length > 0) {
    json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dNomFanEmi"] =
      params["nombreFantasia"];
  }
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dDirEmi"] = params[
    "establecimientos"
  ].filter(e => e.codigo === establecimiento)[0]["direccion"];
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dNumCas"] = params[
    "establecimientos"
  ].filter(e => e.codigo === establecimiento)[0]["numeroCasa"];

  let dCompDir1 = params["establecimientos"].filter(
    e => e.codigo === establecimiento
  )[0]["complementoDireccion1"];
  if (dCompDir1 && (dCompDir1 + "").length > 1) {
    json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dCompDir1"] = dCompDir1;
  }

  let dCompDir2 = params["establecimientos"].filter(
    e => e.codigo === establecimiento
  )[0]["complementoDireccion2"];
  if (dCompDir2 && (dCompDir2 + "").length > 1) {
    json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dCompDir2"] = dCompDir2;
  }

  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["cDepEmi"] = params[
    "establecimientos"
  ].filter(e => e.codigo === establecimiento)[0]["departamento"];
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"][
    "dDesDepEmi"
  ] = departamentos.filter(
    td =>
      td.codigo ===
      params["establecimientos"].filter(e => e.codigo === establecimiento)[0][
        "departamento"
      ]
  )[0]["descripcion"];
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["cDisEmi"] = params[
    "establecimientos"
  ].filter(e => e.codigo === establecimiento)[0]["distrito"];
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dDesDisEmi"] = distritos.filter(
    td =>
      td.codigo ===
      params["establecimientos"].filter(e => e.codigo === establecimiento)[0][
        "distrito"
      ]
  )[0]["descripcion"];
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["cCiuEmi"] = params[
    "establecimientos"
  ].filter(e => e.codigo === establecimiento)[0]["ciudad"];
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dDesCiuEmi"] = ciudades.filter(
    td =>
      td.codigo ===
      params["establecimientos"].filter(e => e.codigo === establecimiento)[0][
        "ciudad"
      ]
  )[0]["descripcion"];
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dTelEmi"] = params[
    "establecimientos"
  ].filter(e => e.codigo === establecimiento)[0]["telefono"];

  if (
    params["establecimientos"].filter(e => e.codigo === establecimiento)[0][
      "email"
    ]
  ) {
    let email = new String(
      params["establecimientos"].filter(e => e.codigo === establecimiento)[0][
        "email"
      ]
    ); //Hace una copia, para no alterar.

    //Verificar si tiene varios correos.
    if (email.indexOf(",") > -1) {
      //Si el Email tiene , (coma) entonces va enviar solo el primer valor, ya que la SET no acepta Comas
      email = email.split(",")[0].trim();
    }

    json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dEmailE"] = email.trim();
  }
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dDenSuc"] = params[
    "establecimientos"
  ].filter(e => e.codigo === establecimiento)[0]["denominacion"];

  if (
    params["actividadesEconomicas"] &&
    params["actividadesEconomicas"].length > 0
  ) {
    json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["gActEco"] = [];
    for (let i = 0; i < params["actividadesEconomicas"].length; i++) {
      const actividadEconomica = params["actividadesEconomicas"][i];
      const gActEco = {
        cActEco: actividadEconomica.codigo,
        dDesActEco: actividadEconomica.descripcion
      };
      json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["gActEco"].push(gActEco);
    }
  } else {
    //throw new Error('Debe proveer el array de actividades económicas en params.actividadesEconomicas');
  }
};
const generateDatosGeneralesResponsableGeneracionDE = data => {
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["gRespDE"] = {
    iTipIDRespDE: data["usuario"]["documentoTipo"],
    dDTipIDRespDE: tiposDocumentosIdentidades.filter(
      td => td.codigo === +data["usuario"]["documentoTipo"]
    )[0]["descripcion"]
  };

  if (data["usuario"]["documentoTipo"] == 9) {
    json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["gRespDE"]["dDTipIDRespDE"] =
      data["usuario"]["documentoTipoDescripcion"];
  }

  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["gRespDE"]["dNumIDRespDE"] =
    data["usuario"]["documentoNumero"];
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["gRespDE"]["dNomRespDE"] =
    data["usuario"]["nombre"];
  json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["gRespDE"]["dCarRespDE"] =
    data["usuario"]["cargo"];
};
const generateDatosEspecificosPorTipoDE = data => {
  json["rDE"]["DE"]["gDtipDE"] = {};

  if (+data["tipoDocumento"] === 1) {
    generateDatosEspecificosPorTipoDE_FacturaElectronica(data);
  }
  if (+data["tipoDocumento"] === 4) {
    generateDatosEspecificosPorTipoDE_Autofactura(data);
  }

  if (+data["tipoDocumento"] === 5 || data["tipoDocumento"] === 6) {
    generateDatosEspecificosPorTipoDE_NotaCreditoDebito(data);
  }

  if (+data["tipoDocumento"] === 7) {
    generateDatosEspecificosPorTipoDE_RemisionElectronica(data);
  }
};
const generateDatosEspecificosPorTipoDE_Autofactura = data => {
  json["rDE"]["DE"]["gDtipDE"]["gCamAE"] = {
    iNatVen: data["autoFactura"]["tipoVendedor"], //1=No contribuyente, 2=Extranjero
    dDesNatVen: naturalezaVendedorAutofactura.filter(
      nv => nv.codigo === data["autoFactura"]["tipoVendedor"]
    )[0]["descripcion"],
    iTipIDVen: data["autoFactura"]["documentoTipo"],
    dDTipIDVen: tiposDocumentosIdentidades.filter(
      td => td.codigo === data["autoFactura"]["documentoTipo"]
    )[0]["descripcion"],
    dNumIDVen: data["autoFactura"]["documentoNumero"],
    dNomVen: data["autoFactura"]["nombre"],
    dDirVen: data["autoFactura"]["direccion"],
    dNumCasVen: data["autoFactura"]["numeroCasa"],

    cDepVen: +data["autoFactura"]["departamento"],
    dDesDepVen: departamentos.filter(
      td => td.codigo === +data["autoFactura"]["departamento"]
    )[0]["descripcion"],
    cDisVen: +data["autoFactura"]["distrito"],
    dDesDisVen: distritos.filter(
      td => td.codigo === +data["autoFactura"]["distrito"]
    )[0]["descripcion"],
    cCiuVen: +data["autoFactura"]["ciudad"],
    dDesCiuVen: ciudades.filter(
      td => td.codigo === +data["autoFactura"]["ciudad"]
    )[0]["descripcion"],
    dDirProv: data["autoFactura"]["ubicacion"]["lugar"],
    cDepProv: +data["autoFactura"]["ubicacion"]["departamento"],
    dDesDepProv: departamentos.filter(
      td => td.codigo === +data["autoFactura"]["ubicacion"]["departamento"]
    )[0]["descripcion"],
    cDisProv: +data["autoFactura"]["ubicacion"]["distrito"],
    dDesDisProv: distritos.filter(
      td => td.codigo === +data["autoFactura"]["ubicacion"]["distrito"]
    )[0]["descripcion"],
    cCiuProv: +data["autoFactura"]["ubicacion"]["ciudad"],
    dDesCiuProv: ciudades.filter(
      td => td.codigo === +data["autoFactura"]["ubicacion"]["ciudad"]
    )[0]["descripcion"]
  };
};

const generateDatosEspecificosPorTipoDE_NotaCreditoDebito = data => {
  json["rDE"]["DE"]["gDtipDE"]["gCamNCDE"] = {
    iMotEmi: +data["notaCreditoDebito"]["motivo"],
    dDesMotEmi: notasCreditosMotivos.filter(
      nv => nv.codigo === +data["notaCreditoDebito"]["motivo"]
    )[0]["descripcion"]
  };
};

const generateDatosEspecificosPorTipoDE_RemisionElectronica = data => {
  json["rDE"]["DE"]["gDtipDE"]["gCamNRE"] = {
    iMotEmiNR: +data["remision"]["motivo"], //E501
    dDesMotEmiNR: remisionesMotivos.filter(
      nv => nv.codigo === +data["remision"]["motivo"]
    )[0]["descripcion"],
    iRespEmiNR: +data["remision"]["tipoResponsable"],
    dDesRespEmiNR: remisionesResponsables.filter(
      nv => nv.codigo === +data["remision"]["tipoResponsable"]
    )[0]["descripcion"]
  };

  if (+data["remision"]["motivo"] == 99) {
    json["rDE"]["DE"]["gDtipDE"]["gCamNRE"]["dDesMotEmiNR"] =
      data["remision"]["motivoDescripcion"];
  }
  //if (data['remision']['kms']) {
  //NT009 pasa a ser obligatorio
  json["rDE"]["DE"]["gDtipDE"]["gCamNRE"]["dKmR"] = data["remision"]["kms"];
  //}
  if (data["remision"]["fechaFactura"]) {
    json["rDE"]["DE"]["gDtipDE"]["gCamNRE"]["dFecEm"] =
      data["remision"]["fechaFactura"];
  }
  if (data["remision"]["costoFlete"]) {
    json["rDE"]["DE"]["gDtipDE"]["gCamNRE"]["cPreFle"] =
      data["remision"]["costoFlete"];
  }
};

const generateDatosEspecificosPorTipoDE_FacturaElectronica = data => {
  json["rDE"]["DE"]["gDtipDE"]["gCamFE"] = {
    iIndPres: data["factura"]["presencia"],
    dDesIndPres: constanteService.indicadoresPresencias.filter(
      ip => ip.codigo === +data["factura"]["presencia"]
    )[0]["descripcion"]
    //dFecEmNR : data['factura']['fechaEnvio']
  };

  if (data["factura"]["fechaEnvio"]) {
    let fechaFactura = new Date(data["fecha"]);
    let fechaEnvio = new Date(data["factura"]["fechaEnvio"]);

    if (fechaFactura.getTime() > fechaEnvio.getTime()) {
      /*throw new Error(
          "La Fecha de envío '" +
            data['factura']['fechaEnvio'] +
            "'en data.factura.fechaEnvio, debe ser despues de la fecha de Factura",
        );*/
    }
    json["rDE"]["DE"]["gDtipDE"]["gCamFE"]["dFecEmNR"] =
      data["factura"]["fechaEnvio"];
  }
  if (data["cliente"]["tipoOperacion"] === 3) {
    generateDatosEspecificosPorTipoDE_ComprasPublicas(data);
  }
  const generateDatosEspecificosPorTipoDE_ComprasPublicas = data => {
    if (
      !(
        data["dncp"] &&
        data["dncp"]["modalidad"] &&
        data["dncp"]["modalidad"].length > 0
      )
    ) {
      //throw new Error('Debe informar la modalidad de Contratación DNCP en data.dncp.modalidad');
    }
    if (
      !(
        data["dncp"] &&
        data["dncp"]["entidad"] &&
        data["dncp"]["entidad"].length > 0
      )
    ) {
      //throw new Error('Debe informar la entidad de Contratación DNCP en data.dncp.entidad');
    }
    if (
      !(data["dncp"] && data["dncp"]["año"] && data["dncp"]["año"].length > 0)
    ) {
      //throw new Error('Debe informar la año de Contratación DNCP en data.dncp.año');
    }
    if (
      !(
        data["dncp"] &&
        data["dncp"]["secuencia"] &&
        data["dncp"]["secuencia"].length > 0
      )
    ) {
      //throw new Error('Debe informar la secuencia de Contratación DNCP en data.dncp.secuencia');
    }
    if (
      !(
        data["dncp"] &&
        data["dncp"]["fecha"] &&
        data["dncp"]["fecha"].length > 0
      )
    ) {
      //throw new Error('Debe informar la fecha de emisión de código de Contratación DNCP en data.dncp.fecha');
    }

    json["rDE"]["DE"]["gDtipDE"]["gCamFE"]["gCompPub"] = {
      dModCont: data["dncp"]["modalidad"],
      dEntCont: data["dncp"]["entidad"],
      dAnoCont: data["dncp"]["año"],
      dSecCont: data["dncp"]["secuencia"],
      dFeCodCont: data["dncp"]["fecha"]
    };
  };
};

const generateDatosCondicionOperacionDE = (params, data) => {
  if (!data["condicion"]) {
    return;
  }

  json["rDE"]["DE"]["gDtipDE"]["gCamCond"] = {
    iCondOpe: data["condicion"]["tipo"],
    dDCondOpe: constanteService.condicionesOperaciones.filter(
      co => co.codigo === data["condicion"]["tipo"]
    )[0]["descripcion"]
  };

  //if (data['condicion']['tipo'] === 1) {
  generateDatosCondicionOperacionDE_Contado(data);
  //}

  if (data["condicion"]["tipo"] === 2) {
    generateDatosCondicionOperacionDE_Credito(params, data);
  }
};
const generateDatosCondicionOperacionDE_Contado = data => {
  if (
    data["condicion"]["entregas"] &&
    data["condicion"]["entregas"].length > 0
  ) {
    const entregas = [];
    for (let i = 0; i < data["condicion"]["entregas"].length; i++) {
      const dataEntrega = data["condicion"]["entregas"][i];

      const cuotaInicialEntrega = {
        iTiPago: dataEntrega["tipo"],
        dDesTiPag: constanteService.condicionesTiposPagos.filter(
          co => co.codigo === dataEntrega["tipo"]
        )[0]["descripcion"]
      };

      cuotaInicialEntrega["dMonTiPag"] = parseFloat(
        dataEntrega["monto"]
      ).toFixed(4);

      if (dataEntrega["tipo"] == 99) {
        cuotaInicialEntrega["dDesTiPag"] = dataEntrega["tipoDescripcion"];
      }

      cuotaInicialEntrega["cMoneTiPag"] = dataEntrega["moneda"];
      cuotaInicialEntrega["dDMoneTiPag"] = constanteService.monedas.filter(
        m => m.codigo == dataEntrega["moneda"]
      )[0]["descripcion"];

      if (dataEntrega["moneda"] != "PYG") {
        if (dataEntrega["cambio"]) {
          cuotaInicialEntrega["dTiCamTiPag"] = dataEntrega["cambio"];
        }
      }

      //Verificar si el Pago es con Tarjeta de crédito
      if (dataEntrega["tipo"] === 3 || dataEntrega["tipo"] === 4) {
        cuotaInicialEntrega["gPagTarCD"] = {
          iDenTarj: dataEntrega["infoTarjeta"]["tipo"],
          dDesDenTarj:
            +dataEntrega["infoTarjeta"]["tipo"] === 99
              ? dataEntrega["infoTarjeta"]["tipoDescripcion"]
              : constanteService.tarjetasCreditosTipos.filter(
                  co => co.codigo === dataEntrega["infoTarjeta"]["tipo"]
                )[0]["descripcion"]
        };

        if (
          dataEntrega["infoTarjeta"]["razonSocial"] &&
          dataEntrega["infoTarjeta"]["ruc"]
        ) {
          //Solo si se envia éste dato
          cuotaInicialEntrega["gPagTarCD"]["dRSProTar"] =
            dataEntrega["infoTarjeta"]["razonSocial"];
          cuotaInicialEntrega["gPagTarCD"]["dRUCProTar"] = dataEntrega[
            "infoTarjeta"
          ]["ruc"].split("-")[0];
          cuotaInicialEntrega["gPagTarCD"]["dDVProTar"] = dataEntrega[
            "infoTarjeta"
          ]["ruc"].split("-")[1];
        }

        cuotaInicialEntrega["gPagTarCD"]["iForProPa"] =
          dataEntrega["infoTarjeta"]["medioPago"];

        if (dataEntrega["infoTarjeta"]["codigoAutorizacion"]) {
          if (
            !(
              (dataEntrega["infoTarjeta"]["codigoAutorizacion"] + "").length >=
                6 &&
              (dataEntrega["infoTarjeta"]["codigoAutorizacion"] + "").length <=
                10
            )
          ) {
          }
          cuotaInicialEntrega["gPagTarCD"]["dCodAuOpe"] = +dataEntrega[
            "infoTarjeta"
          ]["codigoAutorizacion"];
        }

        if (dataEntrega["infoTarjeta"]["titular"]) {
          cuotaInicialEntrega["gPagTarCD"]["dNomTit"] =
            dataEntrega["infoTarjeta"]["titular"];
        }

        if (dataEntrega["infoTarjeta"]["numero"]) {
          cuotaInicialEntrega["gPagTarCD"]["dNumTarj"] =
            dataEntrega["infoTarjeta"]["numero"];
        }
      }

      //Verificar si el Pago es con Cheque
      if (dataEntrega["tipo"] === 2) {
        if (!dataEntrega["infoCheque"]) {
        }

        cuotaInicialEntrega["gPagCheq"] = {
          dNumCheq: leftZero(dataEntrega["infoCheque"]["numeroCheque"], 8),
          dBcoEmi: dataEntrega["infoCheque"]["banco"]
        };
      }
      entregas.push(cuotaInicialEntrega);
    }
    json["rDE"]["DE"]["gDtipDE"]["gCamCond"]["gPaConEIni"] = entregas; //Array de Entregas
  }
};
const generateDatosCondicionOperacionDE_Credito = data => {
  json["rDE"]["DE"]["gDtipDE"]["gCamCond"]["gPagCred"] = {
    iCondCred: data["condicion"]["credito"]["tipo"],
    dDCondCred: condicionesCreditosTipos.filter(
      co => co.codigo === +data["condicion"]["credito"]["tipo"]
    )[0]["descripcion"]
  };

  if (+data["condicion"]["credito"]["tipo"] === 1) {
    //Plazo

    json["rDE"]["DE"]["gDtipDE"]["gCamCond"]["gPagCred"]["dPlazoCre"] =
      data["condicion"]["credito"]["plazo"];
  }

  if (+data["condicion"]["credito"]["tipo"] === 2) {
    //Cuota

    json["rDE"]["DE"]["gDtipDE"]["gCamCond"]["gPagCred"]["dCuotas"] = +data[
      "condicion"
    ]["credito"]["cuotas"];
  }

  if (
    data["condicion"]["entregas"] &&
    data["condicion"]["entregas"].length > 0
  ) {
    let sumaEntregas = 0;
    //Obtiene la sumatoria
    for (let i = 0; i < data["condicion"]["entregas"].length; i++) {
      const entrega = data["condicion"]["entregas"][i];
      sumaEntregas += entrega["monto"]; //Y cuando es de moneda diferente ? como hace?
    }

    json["rDE"]["DE"]["gDtipDE"]["gCamCond"]["gPagCred"][
      "dMonEnt"
    ] = sumaEntregas;
  }

  //Recorrer array de infoCuotas e informar en el JSON
  if (data["condicion"]["credito"]["tipo"] === 2) {
    json["rDE"]["DE"]["gDtipDE"]["gCamCond"]["gPagCred"]["gCuotas"] = [];
    //A Cuotas
    if (
      data["condicion"]["credito"]["infoCuotas"] &&
      data["condicion"]["credito"]["infoCuotas"].length > 0
    ) {
      for (
        let i = 0;
        i < data["condicion"]["credito"]["infoCuotas"].length;
        i++
      ) {
        const infoCuota = data["condicion"]["credito"]["infoCuotas"][i];

        const gCuotas = {
          cMoneCuo: infoCuota["moneda"],
          dDMoneCuo: monedas.filter(co => co.codigo === infoCuota["moneda"])[0][
            "descripcion"
          ],
          dMonCuota: infoCuota["monto"]
        };

        if (infoCuota["vencimiento"]) {
          gCuotas["dVencCuo"] = infoCuota["vencimiento"];
        }
        json["rDE"]["DE"]["gDtipDE"]["gCamCond"]["gPagCred"]["gCuotas"].push(
          gCuotas
        );
      }
    } else {
      //throw new Error('Debe proporcionar data.condicion.credito.infoCuotas[]');
    }
  }
};
