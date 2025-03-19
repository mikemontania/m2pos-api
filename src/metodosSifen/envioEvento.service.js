"use strict";

const https = require("https");
const axios = require("axios");
const wsdlEventoDoc = `${process.env.SIFEN_URL}de/ws/eventos/evento.wsdl`;  
const xml2js = require('xml2js');  
const { generateXMLEvento } = require("./service/eventoMain.service");

 const loadData = (tipo,documento, empresa) =>{
    console.log(tipo)
    console.log(typeof(tipo))
    let data;
    switch (tipo) {
        case 1:
            data = {
                id: documento.id,
                cdc: documento.cdc,
                tipoEvento:1,
                empresaId: empresa.id,
                motivo: "Error de contabilización",
                certificado: empresa.certificado
            };
             break; 
        case 2:
            const [establecimiento, punto, numeroFactura] = documento.nroComprobante.split("-") || [];

            if (!establecimiento || !punto || !numeroFactura) {
                console.error((`[${new Date().toISOString()}] ❌ ERROR: Formato incorrecto en nroComprobante`));
                throw new Error("Formato incorrecto en nroComprobante");
            }

            data = {
                id: documento.id,
                cdc: documento.cdc,
                tipoEvento:2,
                empresaId: empresa.id,
                version: process.env.EKUATIA_VERSION,
                timbrado: documento.timbrado,
                establecimiento,
                punto,
                desde: numeroFactura,
                hasta: numeroFactura,
                tipoDocumento: "01",
                motivo: "Error de contabilización",
                certificado: empresa.certificado
            };
            console.log((`[${new Date().toISOString()}] 🔹 Evento tipo 2 generado correctamente`));
            break;

        default:
            console.error((`[${new Date().toISOString()}] ❌ ERROR: Tipo de evento incorrecto => ${tipo}`));
            throw new Error("Tipo de evento inválido"); 
    }
    return data
 }
const envioEventoXml = (tipo,documento, empresa) => {
    console.log(tipo)
    return new Promise(async (resolve, reject) => {
        try {
        const { cert, key } = empresa.certificado; 

        const  data = await loadData(tipo,documento, empresa);
        console.log(data)

        const soapXMLData = await generateXMLEvento(data);

       let defaultConfig = {             debug: false,              timeout: 90000,             debug: true,            };

       const httpsAgent = new https.Agent({
                cert: Buffer.from(cert, "utf8"),
                key: Buffer.from(key, "utf8"),
            });

        const headers = {
                headers: {
                    "User-Agent": "facturaSend",
                    "Content-Type": "application/soap+xml",
                },
                httpsAgent,
                timeout: defaultConfig.timeout,
            }
            
            console.log(soapXMLData)
            console.log('enviado a  => '+wsdlEventoDoc) 
            axios.post(wsdlEventoDoc, soapXMLData, headers)
                .then(async (respuestaSuccess) => {
                    console.log(`✅ Respuesta positiva`, respuestaSuccess.data || respuestaSuccess);
                    resolve(respuestaSuccess.data);
                })
                .catch(async (err) => {
                    console.error(`❌ error al realizar de request evento tipo ${tipo}`, err.response?.data);
                    reject(err.response?.data);
                });

        } catch (error) {
            console.error(`❌ error al realizar evento tipo ${tipo} de documento ${documento.cdc} => `, error.message);
            reject(error);
        }
    });
}
 
const extraeRespEvento  = async (xml) => {
    try {
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xml);

        const body = result["env:Envelope"]["env:Body"]["ns2:rRetEnviEventoDe"];
        const gResProcEVe = body["ns2:gResProcEVe"];

        const dEstRes = gResProcEVe["ns2:dEstRes"];
        const gResProc = gResProcEVe["ns2:gResProc"];
        const dCodRes = gResProc["ns2:dCodRes"];
        const dMsgRes = gResProc["ns2:dMsgRes"];

        return { codigo: dCodRes, estado: dEstRes, observacion: dMsgRes };
    } catch (error) {
        console.error("Error procesando XML:", error);
        return null;
    }
};
module.exports = {
    extraeRespEvento,
    envioEventoXml
};