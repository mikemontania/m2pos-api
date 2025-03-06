const { defaultConfig } = require("./config");
const {
  tiposDocumentos,
  tiposEmisiones,
  departamentos,
  distritos,
  ciudades,
  tiposDocumentosIdentidades,
  paises,
  tiposDocumentosReceptor,
  indicadoresPresencias,
  naturalezaVendedorAutofactura,
  notasCreditosMotivos,
  remisionesMotivos,
  remisionesResponsables,
  condicionesOperaciones,
  condicionesTiposPagos,
  monedas,
  tarjetasCreditosTipos,
  condicionesCreditosTipos,
  tiposTransacciones,
  tiposImpuestos,
  globalPorItem,
  obligaciones
} = require("./constants.service");
const {
  generateDatosComplementariosComercialesDeUsoEspecificos
} = require("./jsonDteComplementario.service");
const {
  generateDatosComercialesUsoGeneral
} = require("./jsonDteComplementariosComerciales.service");
const {
  generateDatosDocumentoAsociado
} = require("./jsonDteIdentificacionDocumento.service");
const { generateDatosItemsOperacion } = require("./jsonDteItem.service");
const { generateDatosTotales } = require("./jsonDteTotales.service");
const { generateDatosTransporte } = require("./jsonDteTransporte.service");
const { leftZero, normalizeXML, convertToJSONFormat } = require("./util");
const xml2js = require("xml2js");

const generateXMLDE = (params, data) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(generateXMLDeService(params, data));
    } catch (error) {
      reject(error);
    }
  });
};

const generateXMLDeService = (params, data) => {
  try {
    let json = {};
    addDefaultValues(data);
    json = {
      rDE: {
        $: {
          xmlns: "http://ekuatia.set.gov.py/sifen/xsd",
          "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
          "xsi:schemaLocation":
            "http://ekuatia.set.gov.py/sifen/xsd siRecepDE_v150.xsd"
        },
        dVerFor: process.env.EKUATIA_VERSION
      }
    };

    let fechaFirmaDigital = new Date();
    if (data.fechaFirmaDigital) {
      fechaFirmaDigital = new Date(data.fechaFirmaDigital);
    }
    let digitoVerificadorString = data.cdc + "";
    json["rDE"]["DE"] = {
      $: {
        Id: data.cdc
      },
      dDVId: digitoVerificadorString.substring(
        digitoVerificadorString.length - 1,
        digitoVerificadorString.length
      ),
      dFecFirma: convertToJSONFormat(fechaFirmaDigital),
      dSisFact: 1
    };
    //---
    generateDatosOperacion(params, data, json);
    generateDatosTimbrado(params, data, json);
    generateDatosGenerales(params, data, json);
    //---
    generateDatosEspecificosPorTipoDE(data, json);
    if (data.tipoDocumento == 1 || data.tipoDocumento == 4) {
      generateDatosCondicionOperacionDE(data, json);
    }

    //['gDtipDE']=E001
    json["rDE"]["DE"]["gDtipDE"]["gCamItem"] = generateDatosItemsOperacion(
      data
    );
    let gCamEsp = generateDatosComplementariosComercialesDeUsoEspecificos(data);
    if (gCamEsp) {
      json["rDE"]["DE"]["gDtipDE"]["gCamEsp"] = gCamEsp;
    }

    if (data.tipoDocumento == 1 || data.tipoDocumento == 7) {
      //1 Opcional, 7 Obligatorio
      if (data["detalleTransporte"]) {
        json["rDE"]["DE"]["gDtipDE"]["gTransp"] = generateDatosTransporte(data);
      }
    }

    if (data.tipoDocumento != 7) {
      const items = json["rDE"]["DE"]["gDtipDE"]["gCamItem"];
      json["rDE"]["DE"]["gTotSub"] = generateDatosTotales(data, items);
    }

    if (data["complementarios"]) {
      json["rDE"]["DE"]["gCamGen"] = generateDatosComercialesUsoGeneral(data);
    }

    if (
      data.tipoDocumento == 1 ||
      data.tipoDocumento == 4 ||
      data.tipoDocumento == 5 ||
      data.tipoDocumento == 6 ||
      data.tipoDocumento == 7
    ) {
      if (data["documentoAsociado"]) {
        if (!Array.isArray(data["documentoAsociado"])) {
          json["rDE"]["DE"]["gCamDEAsoc"] = generateDatosDocumentoAsociado(
            data["documentoAsociado"],
            data
          );
        } else {
          //Caso sea un array.
          json["rDE"]["DE"]["gCamDEAsoc"] = new Array();

          for (var i = 0; i < data["documentoAsociado"].length; i++) {
            const dataDocumentoAsociado = data["documentoAsociado"][i];

            json["rDE"]["DE"]["gCamDEAsoc"].push(
              generateDatosDocumentoAsociado(dataDocumentoAsociado, data)
            );
          }
        }
      }
    }
    const builder = new xml2js.Builder({
      xmldec: {
        version: "1.0",
        encoding: "UTF-8",
        standalone: false
      }
    });
    var xml = builder.buildObject(json);

    return normalizeXML(xml); //Para firmar tiene que estar normalizado
  } catch (error) {
    console.error("❌ Error generateXMLDeService:", error.message);
  }
};

/**
   * Añade algunos valores por defecto al JSON de entrada, valido para
   * todas las operaciones
   * @param data
   */
const addDefaultValues = data => {
  try {
    if (
      tiposDocumentos.filter(um => um.codigo === +data.tipoDocumento)
        .length == 0
    ) {
      //No quitar este throw
      throw new Error(
        "Tipo de Documento '" +
          data.tipoDocumento +
          "' en data.tipoDocumento no válido. Valores: " +
          tiposDocumentos.map(a => a.codigo + "-" + a.descripcion)
      );
    }
    data["tipoDocumentoDescripcion"] = tiposDocumentos.filter(
      td => td.codigo == +data.tipoDocumento
    )[0]["descripcion"];

    if (!data["tipoEmision"]) {
      data["tipoEmision"] = 1;
    }

    if (!data["tipoTransaccion"]) {
      data["tipoTransaccion"] = 1;
    }

    if (!data["moneda"]) {
      data["moneda"] = "PYG";
    }

    if (data["moneda"] != "PYG") {
      if (!data["condicionTipoCambio"]) {
        data["condicionTipoCambio"] = 1; //Por el Global
      }
    }

    //Valores por defecto para los items
    if (data["items"] && data["items"].length > 0) {
      for (let i = 0; i < data["items"].length; i++) {
        const item = data["items"][i];
        if (!item["unidadMedida"]) {
          item["unidadMedida"] = 77;
        }
      }
    }
  } catch (error) {
    console.error("error", error.message);
  }
};

/**
     * Datos inerentes a la operacion 
     * <gOpeDE>
            <iTipEmi>1</iTipEmi>
            <dDesTipEmi>Normal</dDesTipEmi>
            <dCodSeg>000000023</dCodSeg>
            <dInfoEmi>1</dInfoEmi>
            <dInfoFisc>Información de interés del Fisco respecto al DE</dInfoFisc>
        </gOpeDE>

     * @param params 
     * @param data 
     * @param options 
     */
const generateDatosOperacion = (params, data, json) => {
  try {
    json["rDE"]["DE"]["gOpeDE"] = {
      iTipEmi: data["tipoEmision"],
      dDesTipEmi: tiposEmisiones.filter(
        td => td.codigo == data["tipoEmision"]
      )[0]["descripcion"],
      dCodSeg: data.codigoSeguridad
    };

    if (data["observacion"] && data["observacion"].length > 0) {
      json["rDE"]["DE"]["gOpeDE"]["dInfoEmi"] = data["observacion"];
    }

    if (data["descripcion"] && data["descripcion"].length > 0) {
      json["rDE"]["DE"]["gOpeDE"]["dInfoFisc"] = data["descripcion"];
    }
  } catch (error) {
    console.error(error);
  }
};

/**
     * Genera los datos del timbrado
     * 
     * <gTimb>
			<iTiDE>1</iTiDE>
			<dDesTiDE>Factura electrónica</dDesTiDE>
			<dNumTim>12345678</dNumTim>
			<dEst>001</dEst>
			<dPunExp>001</dPunExp>
			<dNumDoc>1000050</dNumDoc>
			<dSerieNum>AB</dSerieNum>
			<dFeIniT>2019-08-13</dFeIniT>
		</gTimb>

     * @param params 
     * @param data 
     * @param options 
     */
const generateDatosTimbrado = (params, data, json) => {
  json["rDE"]["DE"]["gTimb"] = {
    iTiDE: data.tipoDocumento,
    dDesTiDE: data["tipoDocumentoDescripcion"],
    dNumTim: params["timbradoNumero"],
    dEst: leftZero(data["establecimiento"], 3),
    dPunExp: leftZero(data["punto"], 3),
    dNumDoc: leftZero(data["numero"], 7)
    //dSerieNum : null,
    //dFeIniT: params['timbradoFecha'].substring(0, 10),
  };

  if (data["numeroSerie"]) {
    json["rDE"]["DE"]["gTimb"]["dSerieNum"] = data["numeroSerie"];
  }
  if (data["serie"]) {
    json["rDE"]["DE"]["gTimb"]["dSerieNum"] = data["serie"];
  }
  //if (data['numeroSerie']) {
  json["rDE"]["DE"]["gTimb"]["dFeIniT"] = params["timbradoFecha"].substring(
    0,
    10
  );
  //}
};

/**
     * Genera los campos generales, divide las actividades en diferentes metodos
     * 
     *  <gDatGralOpe>
            <dFeEmiDE>2020-05-07T15:03:57</dFeEmiDE>
        </gDatGralOpe>
     * 
     * @param params 
     * @param data 
     * @param options 
     */
const generateDatosGenerales = (params, data, json) => {
  try {
    json["rDE"]["DE"]["gDatGralOpe"] = {
      dFeEmiDE: data["fecha"]
    };
    console.log(
      "generateDatosGeneralesInherentesOperacion(params, data, json);"
    );
    generateDatosGeneralesInherentesOperacion(params, data, json);
    console.log("generateDatosGeneralesEmisorDE(params, data, json);");
    generateDatosGeneralesEmisorDE(params, data, json);
    console.log("defaultConfig.userObjectRemove == false");
    if (defaultConfig.userObjectRemove == false) {
      //Si está TRUE no crea el objeto usuario
      if (data["usuario"]) {
        //No es obligatorio
        generateDatosGeneralesResponsableGeneracionDE(data, json);
      }
    }
    console.log("generateDatosGeneralesReceptorDE(data, json);");
    generateDatosGeneralesReceptorDE(data, json);
  } catch (error) {
    console.log("❌error", error.message);
  }
};

/**
     * D1. Campos inherentes a la operación comercial (D010-D099)
     * Pertenece al grupo de datos generales
     * 
     * <gOpeCom>
            <iTipTra>1</iTipTra>
            <dDesTipTra>Venta de mercadería</dDesTipTra>
            <iTImp>1</iTImp>
            <dDesTImp>IVA</dDesTImp>
            <cMoneOpe>PYG</cMoneOpe>
            <dDesMoneOpe>Guarani</dDesMoneOpe>
        </gOpeCom>
 
     */
const generateDatosGeneralesInherentesOperacion = (params, data, json) => {
  if (data.tipoDocumento == 7) {
    //C002
    return; //No informa si el tipo de documento es 7
  }

  let moneda = data["moneda"];
  if (!moneda && defaultConfig.defaultValues === true) {
    moneda = "PYG";
  }

  json["rDE"]["DE"]["gDatGralOpe"]["gOpeCom"] = {};

  if (data.tipoDocumento == 1 || data.tipoDocumento == 4) {
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

/**
   * D2. Campos que identifican al emisor del Documento Electrónico DE (D100-D129)
   * Pertenece al grupo de datos generales
   *
   * @param params
   * @param data
   * @param options
   */
const generateDatosGeneralesEmisorDE = (params, data, json) => {
  try {
    //Validar si el establecimiento viene en params
    let establecimiento = leftZero(data["establecimiento"], 3);
    //let punto = leftZero(data['punto'], 3);

    if (
      params.establecimientos.filter(um => um.codigo === establecimiento)
        .length == 0
    ) {
    }
    if (params["ruc"].indexOf("-") == -1) {
      //throw new Error('RUC debe contener dígito verificador en params.ruc');
    }

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
    json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dNomEmi"] =
      params["razonSocial"];
    if (
      params["nombreFantasia"] &&
      (params["nombreFantasia"] + "").length > 0
    ) {
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
    /* json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["dDenSuc"] = params["establecimientos"].filter(e => e.codigo === establecimiento)[0]["denominacion"];
  */
    if (
      params["actividadesEconomicas"] &&
      params["actividadesEconomicas"].length > 0
    ) {
      json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["gActEco"] = [];
      for (let i = 0; i < params["actividadesEconomicas"].length; i++) {
        const actividadEconomica = params["actividadesEconomicas"][i];
        console.log(actividadEconomica);
        const gActEco = {
          cActEco: actividadEconomica.codigo,
          dDesActEco: actividadEconomica.descripcion
        };
        json["rDE"]["DE"]["gDatGralOpe"]["gEmis"]["gActEco"].push(gActEco);
      }
    } else {
      //throw new Error('Debe proveer el array de actividades económicas en params.actividadesEconomicas');
    }
  } catch (error) {
    console.error("❌ ❌ Error generateDatosGeneralesEmisorDE", error.message);
  }
};

/**
       * Datos generales del responsable de generacion del DE
       
       */
const generateDatosGeneralesResponsableGeneracionDE = (data, json) => {
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

/**
         * Datos generales del receptor del documento electrónico
         * Pertenece al grupo de datos generales
         * 
         * <gDatRec>
                    <iNatRec>1</iNatRec>
                    <iTiOpe>1</iTiOpe>
                    <cPaisRec>PRY</cPaisRec>
                    <dDesPaisRe>Paraguay</dDesPaisRe>
                    <iTiContRec>2</iTiContRec>
                    <dRucRec>00000002</dRucRec>
                    <dDVRec>7</dDVRec>
                    <dNomRec>RECEPTOR DEL DOCUMENTO</dNomRec>
                    <dDirRec>CALLE 1 ENTRE CALLE 2 Y CALLE 3</dDirRec>
                    <dNumCasRec>123</dNumCasRec>
                    <cDepRec>1</cDepRec>
                    <dDesDepRec>CAPITAL</dDesDepRec>
                    <cDisRec>1</cDisRec>
                    <dDesDisRec>ASUNCION (DISTRITO)</dDesDisRec>
                    <cCiuRec>1</cCiuRec>
                    <dDesCiuRec>ASUNCION (DISTRITO)</dDesCiuRec>
                    <dTelRec>012123456</dTelRec>
                    <dCodCliente>AAA</dCodCliente>
                </gDatRec>
        
         */
const generateDatosGeneralesReceptorDE = (data, json) => {
  try {
    json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"] = {
      iNatRec: data["cliente"]["contribuyente"] ? 1 : 2,
      iTiOpe: +data.cliente.tipoOperacion,
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
        ] = tiposDocumentosReceptor.filter(
          tdr => tdr.codigo === +data["cliente"]["documentoTipo"]
        )[0]["descripcion"];
      }

      if (+data["cliente"]["documentoTipo"] == 9) {
        json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dDTipIDRec"] =
          data["cliente"]["documentoTipoDescripcion"];
      }

      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dNumIDRec"] = (data[
        "cliente"
      ]["documentoNumero"] + "").trim();

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
      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["dNomFanRec"] = data[
        "cliente"
      ]["nombreFantasia"].trim();
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
    if (
      data["cliente"]["departamento"] &&
      +data.cliente.tipoOperacion != 4
    ) {
      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["cDepRec"] = +data["cliente"][
        "departamento"
      ];
      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"][
        "dDesDepRec"
      ] = departamentos.filter(
        td => td.codigo === +data["cliente"]["departamento"]
      )[0]["descripcion"];
    }

    if (data["cliente"]["distrito"] && +data.cliente.tipoOperacion != 4) {
      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["cDisRec"] = +data["cliente"][
        "distrito"
      ];
      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"][
        "dDesDisRec"
      ] = distritos.filter(td => td.codigo === +data["cliente"]["distrito"])[0][
        "descripcion"
      ];
    }

    if (data["cliente"]["ciudad"] && +data.cliente.tipoOperacion != 4) {
      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"]["cCiuRec"] = +data["cliente"][
        "ciudad"
      ];
      json["rDE"]["DE"]["gDatGralOpe"]["gDatRec"][
        "dDesCiuRec"
      ] = ciudades.filter(td => td.codigo === +data["cliente"]["ciudad"])[0][
        "descripcion"
      ];
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
  } catch (error) {
    console.log("generateDatosGeneralesEmisorDE", error.message);
  }
};

/**
   * Campos que seran especificos de acuerdo a cada tipo de documento electronico
   * Se dividiran en diferentes métodos por cada tipo de factura.
  
   */
const generateDatosEspecificosPorTipoDE = (data, json) => {
  json["rDE"]["DE"]["gDtipDE"] = {};

  if (+data.tipoDocumento === 1) {
    generateDatosEspecificosPorTipoDE_FacturaElectronica(data, json);
  }
  if (+data.tipoDocumento === 4) {
    generateDatosEspecificosPorTipoDE_Autofactura(data, json);
  }

  if (+data.tipoDocumento === 5 || data.tipoDocumento === 6) {
    generateDatosEspecificosPorTipoDE_NotaCreditoDebito(data, json);
  }

  if (+data.tipoDocumento === 7) {
    generateDatosEspecificosPorTipoDE_RemisionElectronica(data, json);
  }
};

/**
   * Datos especificos para la factura electronica
 
   */
const generateDatosEspecificosPorTipoDE_FacturaElectronica = (data, json) => {
  if (
    indicadoresPresencias.filter(
      um => um.codigo === +data["factura"]["presencia"]
    ).length == 0
  ) {
  }

  json["rDE"]["DE"]["gDtipDE"]["gCamFE"] = {
    iIndPres: data["factura"]["presencia"],
    dDesIndPres: indicadoresPresencias.filter(
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
  if (data.cliente.tipoOperacion === 3) {
    generateDatosEspecificosPorTipoDE_ComprasPublicas(data, json);
  }
};

/**
   * Datos especificos cuando el tipo de operacion del receptor es B2G (Campo D202)
   * Dentro de la factura electronica
    
   */
const generateDatosEspecificosPorTipoDE_ComprasPublicas = (data, json) => { 
 
  console.log("JSON.stringify ", JSON.stringify(data.factura, null, 2)); 
    json["rDE"]["DE"]["gDtipDE"]["gCamFE"]["gCompPub"] = {
      dModCont: data.factura.dncp.modalidad ,
      dEntCont: data.factura.dncp.entidad ,
      dAnoCont: data.factura.dncp.periodo  ,
      dSecCont:  data.factura.dncp.secuencia ,
      dFeCodCont: data.factura.dncp.fecha  
    }; 
};

const generateDatosEspecificosPorTipoDE_Autofactura = (data, json) => {
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

const generateDatosEspecificosPorTipoDE_NotaCreditoDebito = (data, json) => {
  json["rDE"]["DE"]["gDtipDE"]["gCamNCDE"] = {
    iMotEmi: +data["notaCreditoDebito"]["motivo"],
    dDesMotEmi: notasCreditosMotivos.filter(
      nv => nv.codigo === +data["notaCreditoDebito"]["motivo"]
    )[0]["descripcion"]
  };
};

const generateDatosEspecificosPorTipoDE_RemisionElectronica = (data, json) => {
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

/**
   * E7. Campos que describen la condición de la operación (E600-E699)
   
   */
const generateDatosCondicionOperacionDE = (data, json) => {
  if (!data["condicion"]) {
    return;
  }
  if (
    condicionesOperaciones.filter(um => um.codigo === data["condicion"]["tipo"])
      .length == 0
  ) {
  }

  json["rDE"]["DE"]["gDtipDE"]["gCamCond"] = {
    iCondOpe: data["condicion"]["tipo"],
    dDCondOpe: condicionesOperaciones.filter(
      co => co.codigo === data["condicion"]["tipo"]
    )[0]["descripcion"]
  };

  //if (data['condicion']['tipo'] === 1) {
  generateDatosCondicionOperacionDE_Contado(data, json);
  //}

  if (data["condicion"]["tipo"] === 2) {
    generateDatosCondicionOperacionDE_Credito(data, json);
  }
};

/**
   * E7.1. Campos que describen la forma de pago de la operación al contado o del monto
   * de la entrega inicial (E605-E619)
 
   */
const generateDatosCondicionOperacionDE_Contado = (data, json) => {
  if (
    data["condicion"]["entregas"] &&
    data["condicion"]["entregas"].length > 0
  ) {
    const entregas = [];
    for (let i = 0; i < data["condicion"]["entregas"].length; i++) {
      const dataEntrega = data["condicion"]["entregas"][i];

      const cuotaInicialEntrega = {
        iTiPago: dataEntrega["tipo"],
        dDesTiPag: condicionesTiposPagos.filter(
          co => co.codigo === dataEntrega["tipo"]
        )[0]["descripcion"]
      };

      cuotaInicialEntrega["dMonTiPag"] = parseFloat(
        dataEntrega["monto"]
      ).toFixed(4);

      /*if (data.moneda === 'PYG') {
          //Maximo 4 decimales
          let cantDecimalesMontoTipoPago = defaultConfig.pygDecimals;
          if (cantDecimalesMontoTipoPago > 4) {
            cantDecimalesMontoTipoPago = 4;
          }
          cuotaInicialEntrega['dMonTiPag'] = parseFloat(dataEntrega['monto']).toFixed(cantDecimalesMontoTipoPago);
        }*/

      if (dataEntrega["tipo"] == 99) {
        cuotaInicialEntrega["dDesTiPag"] = dataEntrega["tipoDescripcion"];
      }

      cuotaInicialEntrega["cMoneTiPag"] = dataEntrega["moneda"];
      cuotaInicialEntrega["dDMoneTiPag"] = monedas.filter(
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
              : tarjetasCreditosTipos.filter(
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
            /*throw new Error(
                'El código de Autorización en data.condicion.entregas[' +
                  i +
                  '].infoTarjeta.codigoAutorizacion debe tener de 6 y 10 caracteres',
              );*/
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
          /*throw new Error(
              'Debe informar sobre el cheque en data.condicion.entregas[' +
                i +
                '].infoCheque si la forma de Pago es 2-Cheques',
            );*/
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

/**
   * E7.2. Campos que describen la operación a crédito (E640-E649)
 
   */
const generateDatosCondicionOperacionDE_Credito = (data, json) => {
  if (!data["condicion"]["credito"]["tipo"]) {
    /*throw new Error(
        'El tipo de Crédito en data.condicion.credito.tipo es obligatorio si la condición posee créditos',
      );*/
  }

  if (
    condicionesCreditosTipos.filter(
      um => um.codigo === data["condicion"]["credito"]["tipo"]
    ).length == 0
  ) {
  }

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
    if (!data["condicion"]["credito"]["cuotas"]) {
      /*throw new Error(
          'El tipo de Crédito en data.condicion.credito.tipo es 2 entonces data.condicion.credito.cuotas es obligatorio',
        );*/
    }

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

        if (
          monedas.filter(um => um.codigo === infoCuota["moneda"]).length == 0
        ) {
        }

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

module.exports = {
  generateXMLDE
};
