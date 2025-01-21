 "use strict";

const jszip = require("jszip");
const { openFileP12, getPrivateKey, getCertificate } = require('./p12.service');
const xml2js = require("xml2js");
const fs = require("fs");
const https = require("https");
const axios = require("axios");
const Certificado = require("../models/certificado.model");
const wsdlRecibe = `${process.env.SIFEN_URL}de/ws/sync/recibe.wsdl?wsdl`;
const wsdlRecibeLote = `${process.env.SIFEN_URL}de/ws/async/recibe-lote.wsdl?wsdl`;
const wsdlEvento = `${process.env.SIFEN_URL}de/ws/eventos/evento.wsdl?wsdl`;
const wsdlConsultaLote = `${process.env.SIFEN_URL}de/ws/consultas/consulta-lote.wsdl?wsdl`;
const wsdlConsultaRuc = `${process.env.SIFEN_URL}de/ws/consultas/consulta-ruc.wsdl?wsdl`;
const wsdlConsulta = `${process.env.SIFEN_URL}de/ws/consultas/consulta.wsdl?wsdl`;
const {decryptPassphrase } = require('../helpers/encript-helper');
const setApi  = require('facturacionelectronicapy-setapi');

const abrirCertificado = (certificado, passphase) => {
     const p12 = openFileP12(certificado, passphase);
    return {
        cert: getCertificate(p12),
        key: getPrivateKey(p12),
    };
}

const normalizeXML = (xml) => {
    return xml
        .split("\r\n").join("")
        .split("\n").join("")
        .split("\t").join("")
        .split("    ").join("")
        .split(">    <").join("><")
        .split(">  <").join("><")
        .replace(/\r?\n|\r/g, "");
}

const recibeLote = (id, xmls, empresaId,   config = {}) =>{
    return new Promise(async (resolve, reject) => {
        try {
            let defaultConfig = {
                debug: false,
                timeout: 90000,
                ...config,
            };

     

            // Solo devolverá un certificado por empresa
            const certificados = await Certificado.findAll({ where: empresaId });
            if (certificados.length === 0)
              throw new Error("No se encontró un certificado activo para la empresa");
            console.log("Certificado", certificados[0]);
            console.log(certificados[0].passphrase);
            const p12Path = `./src/certificado/${certificados[0].path}`;
            const p12Password = decryptPassphrase(certificados[0].passphrase);
        


            const { cert, key } = abrirCertificado(p12Path, p12Password);

            if (!xmls.length) {
                return reject("No se envió datos en el array de Documentos electrónicos XMLs");
            }

            if (xmls.length > 50) {
                return reject("Sólo se permiten un máximo de 50 Documentos electrónicos XML por lote");
            }

            let url = wsdlRecibeLote;

            const zip = new jszip();
            let rLoteDEXml = "<rLoteDE>\n";
          
            for (let i = 0; i < xmls.length; i++) {
                const xml = xmls[i].split("\n").slice(1).join("\n"); //Retirar xml
                    rLoteDEXml += `${xml}\n`;
            }
            rLoteDEXml += `</rLoteDE>`;
            rLoteDEXml = normalizeXML(rLoteDEXml);  
            zip.file(`xml_file.xml`, `<?xml version="1.0" encoding="UTF-8"?>${rLoteDEXml}`);
            const zipAsBase64 = await zip.generateAsync({ type: "base64" });
          
            const httpsAgent = new https.Agent({
                cert: Buffer.from(cert, "utf8"),
                key: Buffer.from(key, "utf8"),
            });

            let soapXMLData = `<?xml version="1.0" encoding="UTF-8"?>\n\
                <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">\n\
                    <env:Header/>\n\
                    <env:Body>\n\
                        <rEnvioLote xmlns="http://ekuatia.set.gov.py/sifen/xsd">\n\
                            <dId>${id}</dId>\n\
                                <xDE>${zipAsBase64}</xDE>\n\
                        </rEnvioLote>\n\
                    </env:Body>\n\
                </env:Envelope>`;
            soapXMLData = normalizeXML(soapXMLData);
             
            if (soapXMLData) {
                console.log("url", url );
                console.log( "soapXMLData", soapXMLData);
            }

            if (defaultConfig.saveRequestFile) {
                const json = fs.writeFileSync(defaultConfig.saveRequestFile, soapXMLData);
            }
          

            axios
                .post(url, soapXMLData, {
                    headers: {
                        "User-Agent": "facturaSend",
                        "Content-Type": "application/xml; charset=utf-8",
                    },
                    httpsAgent,
                    timeout: defaultConfig.timeout,
                })
                .then((respuestaSuccess) => {
                    if (respuestaSuccess.status === 200) {
                        const parser = new xml2js.Parser({ explicitArray: false });

                        if (respuestaSuccess.data.startsWith("<?xml")) {
                            parser.parseStringPromise(respuestaSuccess.data).then((result) => {
                                const resultData = result["env:Envelope"]["env:Body"];
                                resultData.id = id;
                                console.log(respuestaSuccess.data)
                                resolve(resultData);
                            });
                        } else if (respuestaSuccess.data.startsWith("<html>")) {
                            reject(new Error("Error de la SET BIG-IP logout page"));
                        } else {
                            reject(new Error(respuestaSuccess.data));
                        }
                    } else {
                        reject(new Error("Error de conexión con la SET"));
                    }
                })
                .catch((err) => {
                    if (err.response?.data) {
                        console.log(err.response?.data);
                        const parser = new xml2js.Parser({ explicitArray: false });
                        parser
                            .parseStringPromise(err.response.data)
                            .then((result) => {
                                const resultData = result["env:Envelope"]["env:Body"];
                                resultData.id = id;
                                 // Inspeccionar el contenido de ns2:gResProc
                                resolve(resultData);
                            })
                            .catch(reject);
                    } else {
                        reject(err);
                    }
                });
        } catch (error) {
            reject(error);
        }
    });
}
 
const recibeLoteSifen = async (id, xmlSigned ,  empresaId ) =>{
  
            const certificados = await Certificado.findAll({ where: empresaId });
            if (certificados.length === 0)
              throw new Error("No se encontró un certificado activo para la empresa");
            console.log("Certificado", certificados[0]);
            console.log(certificados[0].passphrase);
            const p12Path = `./src/certificado/${certificados[0].path}`;
            const p12Password = decryptPassphrase(certificados[0].passphrase);

 
 
  try {
    // Firmar el XML usando una promesa
    const send = await new Promise((resolve, reject) => {
        setApi.signXML(id ,xmlSigned,process.env.EKUATIA_ENV, p12Path, p12Password)
        .then((res) => {
          console.log("res:", res);
          resolve(res); // Resolver la promesa con el XML firmado
        })
        .catch((err) => {
          console.error("Error al firmar el XML:", err);
          reject(err); // Rechazar la promesa en caso de error
        });
    });

    return send; // Devolver el XML firmado
  } catch (error) {
    console.error("Error en firmarXml:", error);
    return error; // Devolver el XML original en caso de error
  }
}
module.exports = {
    recibeLoteSifen,
    recibeLote,
};