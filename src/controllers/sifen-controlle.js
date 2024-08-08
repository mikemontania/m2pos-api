const soap = require("soap");
const fs = require("fs");
const path = require("path");
const xmlbuilder = require("xmlbuilder");
const https = require("https");
const axios = require("axios");
const xml2js = require("xml2js");
const { loadCertificateAndKey } = require("../helpers/certificado-helper");
const forge = require("node-forge");
// Definir las URLs completas para cada servicio
const wsdlRecibe = `${process.env.SIFEN_URL}de/ws/sync/recibe.wsdl?wsdl`;
const wsdlRecibeLote = `${process.env
  .SIFEN_URL}de/ws/async/recibe-lote.wsdl?wsdl`;
const wsdlEvento = `${process.env.SIFEN_URL}de/ws/eventos/evento.wsdl?wsdl`;
const wsdlConsultaLote = `${process.env
  .SIFEN_URL}de/ws/consultas/consulta-lote.wsdl?wsdl`;
const wsdlConsultaRuc = `${process.env
  .SIFEN_URL}de/ws/consultas/consulta-ruc.wsdl?wsdl`;
const wsdlConsulta = `${process.env
  .SIFEN_URL}de/ws/consultas/consulta.wsdl?wsdl`;

const normalizarXml = xml => {
  return xml.replace(/\r?\n|\r|\t| {2,}/g, "").replace(/> {1,}</g, "><");
};
const enviarFactura = async (empresaId, cdc, xml) => {
  try {
   
    // Crear el agente HTTPS usando las cadenas PEM directamente
    const { cert, key  } = await loadCertificateAndKey(empresaId);
      const httpsAgent = new https.Agent({
      cert: Buffer.from(cert, "utf8"),
      key: Buffer.from(key, "utf8"),
  });
    // Asegurarse de que xml es una cadena de texto
    if (typeof xml !== "string") {
      throw new Error("El XML debe ser una cadena de texto.");
    }

    xml = xml.split("\n").slice(1).join("\n"); // Retirar <xml>
    let soapXMLData = `<?xml version="1.0" encoding="UTF-8"?>\n\
            <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">\n\
              <env:Header/>\n\
              <env:Body>\n\
                <rEnviDe xmlns="http://ekuatia.set.gov.py/sifen/xsd">\n\
                  <dId>${cdc}</dId>\n\
                  <xDE>${xml}</xDE>\n\
                </rEnviDe>\n\
              </env:Body>\n\
            </env:Envelope>\n`;
    soapXMLData = normalizarXml(soapXMLData);

    const response = await axios.post(wsdlRecibe, soapXMLData, {
      headers: {
        "User-Agent": "facturaSend",
        "Content-Type": "application/xml; charset=utf-8"
      },
      httpsAgent,
      timeout: 90000
    });
console.log(response)
    if (response.status === 200) {
      const parser = new xml2js.Parser({ explicitArray: false });
      if (response.data.startsWith("<?xml")) {
        const result = await parser.parseStringPromise(response.data);
        return result["env:Envelope"]["env:Body"];
      } else if (response.data.startsWith("<html>")) {
        throw new Error("Error de la SET BIG-IP logout page");
      } else {
        throw new Error(response.data);
      }
    } else {
      throw new Error(`Error de conexión con la SET: ${response.statusText}`);
    }
  } catch (error) {
    if (error.response) {
      // La solicitud se hizo y el servidor respondió con un código de estado
      // que está fuera del rango de 2xx
      console.log('Error de respuesta:', error.response.status);
      console.log('Datos del error:', error.response.data);
      console.log('Encabezados del error:', error.response.headers);
      return error.response.data;
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      console.log('Error de solicitud:', error.request);
    } else {
      // Algo pasó al configurar la solicitud
      console.log('Error al configurar:', error.message);
    }
  }
};

// Exportar las funciones para ser utilizadas en otros archivos del proyecto
module.exports = {
  enviarFactura
};
