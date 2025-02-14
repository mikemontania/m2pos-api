"use strict";
 
const https = require("https");
const axios = require("axios");   
const wsdlInutilizarDoc = `${process.env.SIFEN_URL}de/ws/eventos/evento.wsdl?wsdl`;  
const { generarXMLInutilizacion } = require("./generarXml");
const { normalizeXML } = require("./envioLote.service");
const fs = require("fs");  

 
const inutilizarDoc = ( id,nroComprobante, timbrado,empresa) => {
    return new Promise(async (resolve, reject) => {
        try {
             const [establecimiento, punto, numeroFactura] = nroComprobante.split("-"); 
 
            const { cert, key } = empresa.certificado;
              let datos = {  
                  id, 
                version:process.env.EKUATIA_VERSION,
                 timbrado,
                establecimiento,
                punto,
                desde:numeroFactura,
                hasta:numeroFactura,
                tipoDocumento:'01',
                motivo:"Error al facturar", 
                certificado: empresa.certificado
              }
              let xmlFirmado = await generarXMLInutilizacion(datos);  
              
               let soapXMLData = xmlFirmado;   
               let defaultConfig = {
                    debug: false,
                    timeout: 90000,
                    ebug: true,
                }; 
         
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
            if (soapXMLData)  fs.writeFileSync('./soap_request.xml', soapXMLData); 
            soapXMLData = normalizeXML(soapXMLData);
            soapXMLData= soapXMLData.replace(/>\s+</g, '><').trim();
            console.log(soapXMLData)
            console.log(wsdlInutilizarDoc) 
         /*    
            console.log(wsdlInutilizarDoc) */
            axios.post(wsdlInutilizarDoc, soapXMLData, headers)
                .then(async (respuestaSuccess) => { 
                    console.log(`✅ Respuesta positiva`,respuestaSuccess.data || respuestaSuccess);
                    resolve(respuestaSuccess.data);
                })
                .catch(async (err) => {
                    console.error(`❌ error al realizar de request inutilizacion`,err.response?.data); 
                    reject(err.response?.data );
                });

        } catch (error) { 
            console.error(`❌ error al realizar inutilizacion de documento =>`,error.message); 
            reject(error);
        }
    });
}
 

module.exports = {
    inutilizarDoc
};