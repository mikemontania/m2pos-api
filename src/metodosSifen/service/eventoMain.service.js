const xml2js = require("xml2js");
const { convertToJSONFormat, normalizeXML, leftZero } = require("./util");
const fs = require("fs");
const { signXMLEvento } = require("./signxml.service");
const { crearVentaXml } = require("../../controllers/ventaXml-controller");

const generateXMLEvento = data => {
  return new Promise(async (resolve, reject) => {
    try {
      let xmlGenerado = await generateXMLEventoService(data);
      const xmlSinEncoding = xmlGenerado.replace(
        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
        ""
      );
      if (xmlSinEncoding)
        fs.writeFileSync(
          `./eventos/xmlEvento${data.tipoEvento}VentaBase${data.id}_generado.xml`,
          xmlSinEncoding
        );
      let soapXMLData = envelopeEvent(data.id, xmlSinEncoding);
      if (soapXMLData)
        fs.writeFileSync(
          `./eventos/xmlEvento${data.tipoEvento}VentaBase${data.id}_soap.xml`,
          soapXMLData
        );
      await crearVentaXml(data.empresaId, data.id, soapXMLData, 1, "GENERADO");
      const xmlFirmado = await signXMLEvento(soapXMLData, data.certificado);
      if (xmlFirmado)
        fs.writeFileSync(
          `./eventos/xmlEvento${data.tipoEvento}VentaBase${data.id}_firmado.xml`,
          xmlFirmado
        );
      await crearVentaXml(data.empresaId, data.id, xmlFirmado, 2, "FIRMADO");
      resolve(xmlFirmado);
    } catch (error) {
      reject(error);
    }
  });
};

const envelopeEvent = (id, xml) => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
            <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">\n\
                <env:Header/>\n\
                <env:Body>\n\
                    <rEnviEventoDe xmlns="http://ekuatia.set.gov.py/sifen/xsd">\n\
                      <dId>${id}</dId>\n\
                      <dEvReg>${xml}</dEvReg>\n\
                    </rEnviEventoDe>\n\
                </env:Body>\n\
            </env:Envelope>\n`;
};

const generateXMLEventoService = data => {
  let json = {};

  json["gGroupGesEve"] = {};
  json["gGroupGesEve"]["rGesEve"] = {};
  json["gGroupGesEve"]["$"] = {};
  json["gGroupGesEve"]["$"]["xmlns:xsi"] =
    "http://www.w3.org/2001/XMLSchema-instance";
  json["gGroupGesEve"]["$"]["xsi:schemaLocation"] =
    "http://ekuatia.set.gov.py/sifen/xsd siRecepEvento_v150.xsd";

  json["gGroupGesEve"]["rGesEve"]["rEve"] = {};

  json["gGroupGesEve"]["rGesEve"]["rEve"]["$"] = {};
  json["gGroupGesEve"]["rGesEve"]["rEve"]["$"]["Id"] = 1;
  json["gGroupGesEve"]["rGesEve"]["rEve"]["dFecFirma"] = convertToJSONFormat(
    new Date()
  );
  json["gGroupGesEve"]["rGesEve"]["rEve"]["dVerFor"] =
    process.env.EKUATIA_VERSION || "";
  json["gGroupGesEve"]["rGesEve"]["rEve"]["gGroupTiEvt"] = {};

  //Emisor
  if (data.tipoEvento == 1) {
    json["gGroupGesEve"]["rGesEve"]["rEve"][
      "gGroupTiEvt"
    ] = eventosEmisorCancelacion(data);
  }

  if (data.tipoEvento == 2) {
    json["gGroupGesEve"]["rGesEve"]["rEve"][
      "gGroupTiEvt"
    ] = eventosEmisorInutilizacion(data);
  }

  let builder = new xml2js.Builder({
    xmldec: {
      version: "1.0",
      encoding: "UTF-8",
      standalone: false
    }
  });
  let xml = builder.buildObject(json);

  return normalizeXML(xml); //Para firmar tiene que estar normalizado
};

const eventosEmisorCancelacion = data => {
  if (!data["cdc"]) {
    throw new Error("Debe proporcionar el CDC en data.cdc");
  }

  if (!(data["cdc"].length == 44)) {
    throw new Error("El CDC en data.cdc debe tener 44 caracteres");
  }

  if (!data["motivo"]) {
    throw new Error(
      "Debe proporcionar el Motivo de la Cancelación en data.motivo"
    );
  }

  if (
    !((data["motivo"] + "").length >= 5 && (data["motivo"] + "").length <= 500)
  ) {
    throw new Error(
      "El Motivo de la Cancelación en data.motivo debe contener de [5-500] caracteres"
    );
  }

  const jsonResult = {};
  jsonResult["rGeVeCan"] = {
    Id: data["cdc"],
    mOtEve: data["motivo"]
  };

  return jsonResult;
};

const eventosEmisorInutilizacion = data => {
  if (!data["timbrado"]) {
    throw new Error("Falta el Timbrado en data.timbrado");
  }
  if (!data["establecimiento"]) {
    throw new Error("Falta el Establecimiento en data.establecimiento");
  }
  if (new String(data["establecimiento"]).length != 3) {
    throw new Error(
      "El establecimiento debe tener una longitud de 3 caracteres"
    );
  }
  if (!data["punto"]) {
    throw new Error("Falta el Punto en data.punto");
  }
  if (new String(data["punto"]).length != 3) {
    throw new Error("El punto debe tener una longitud de 3 caracteres");
  }

  if (!data["desde"]) {
    throw new Error("Falta el valor inicial Desde en data.desde");
  }
  if (!data["hasta"]) {
    throw new Error("Falta el valor final hasta en data.hasta");
  }
  if (+data["desde"] > +data["hasta"]) {
    throw new Error(
      "El valor inicial en data.desde debe ser inferior o igual al valor final en data.hasta"
    );
  }
  if (!data["tipoDocumento"]) {
    throw new Error("Falta el Tipo de Documento en data.tipoDocumento");
  }
  if (new String(data["timbrado"]).length != 8) {
    throw new Error("El timbrado debe tener una longitud de 8 caracteres");
  }
  if (!data["motivo"]) {
    throw new Error("Falta el Motivo de la Cancelación en data.motivo");
  }
  if (
    !((data["motivo"] + "").length >= 5 && (data["motivo"] + "").length <= 500)
  ) {
    throw new Error(
      "El Motivo de la Inutilización en data.motivo debe contener de [5-500] caracteres"
    );
  }

  if (data["serie"]) {
    if ((data["serie"] + "").length != 2) {
      throw new Error(
        "El número de serie en data.serie debe contener [2] caracteres"
      );
    }
  }

  const jsonResult = {};
  jsonResult["rGeVeInu"] = {
    dNumTim: leftZero(data["timbrado"], 8),
    dEst: leftZero(data["establecimiento"], 3),
    dPunExp: leftZero(data["punto"], 3),
    dNumIn: leftZero(data["desde"], 7),
    dNumFin: leftZero(data["hasta"], 7),
    iTiDE: data["tipoDocumento"],
    mOtEve: data["motivo"]
  };

  if (data["serie"]) {
    jsonResult["rGeVeInu"]["dSerieNum"] = data["serie"];
  }

  return jsonResult;
};

module.exports = {
  generateXMLEvento
};
