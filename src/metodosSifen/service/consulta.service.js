"use strict";
 
const fs = require("fs");
const https = require("https");
const axios = require("axios"); 
const { normalizeXML } = require("./util");
const { crearRespuesta } = require("./respuesta.service");
 
const wsdlConsultaLote = `${process.env.SIFEN_URL}de/ws/consultas/consulta-lote.wsdl`;
const wsdlConsultaCDC = `${process.env.SIFEN_URL}de/ws/consultas/consulta.wsdl`; 

  
const consulta = (data, certificado) => {
    let respuesta = {}
    const config = {
        debug: true,  // Para activar logs de depuración
         saveRequestFile: './consulta_soap_request.xml',  // Opcional: guarda la solicitud SOAP
        // saveFile: './file.xml',  // Opcional: file
    }
    return new Promise(async (resolve, reject) => {
        try {
            let defaultConfig = {
                debug: false,
                timeout: 90000,
                ...config,
            }; 
            const { cert, key } = certificado;  
            const httpsAgent = new https.Agent({
                cert: Buffer.from(cert, "utf8"),
                key: Buffer.from(key, "utf8"),
            });
             let url;
            let soapXMLData;
            if (data.tipoConsulta === "CDC") {
                // Consulta por CDC
                soapXMLData = `
                    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
                                   xmlns:xsd="http://ekuatia.set.gov.py/sifen/xsd">
                        <soap:Header/>
                        <soap:Body>
                            <xsd:rEnviConsDeRequest>
                                <xsd:dId>${data.id}</xsd:dId>
                                <xsd:dCDC>${data.cdc}</xsd:dCDC>
                            </xsd:rEnviConsDeRequest>
                        </soap:Body>
                    </soap:Envelope>`; 
                    url= wsdlConsultaCDC  ; 
            } else {
                // Consulta por Lote
                soapXMLData =  `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">\n\
                <soap:Header/>\n\
                <soap:Body>\n\
                    <xsd:rEnviConsLoteDe xmlns:xsd="http://ekuatia.set.gov.py/sifen/xsd">\n\
                        <xsd:dId>${data.id}</xsd:dId>\n\
                        <xsd:dProtConsLote>${data.numeroLote}</xsd:dProtConsLote>\n\
                    </xsd:rEnviConsLoteDe>\n\
                </soap:Body>\n\
            </soap:Envelope>`; 
 
             url= wsdlConsultaLote  ; 
            }

 
                soapXMLData = normalizeXML(soapXMLData);
                soapXMLData= soapXMLData.replace(/>\s+</g, '><').trim();
     
            console.log(soapXMLData)
            const headers = {
                headers: {
                    "User-Agent": "facturaSend",
                    "Content-Type": "application/soap+xml",
                },
                httpsAgent,
                timeout: defaultConfig.timeout,
            }
            console.log(headers)
            console.log(url)
            axios.post(url, soapXMLData, headers)
                .then(async (respuestaSuccess) => {
                    console.log(`✅  consulta.then =>`,respuestaSuccess.data);
                    let respuesta;
                    if (respuestaSuccess.status === 200) {
                        if (respuestaSuccess.data.startsWith("<?xml")) {
                             respuesta = await crearRespuesta(data.id,respuestaSuccess.data, '')
                        } else {
                            respuesta = await crearRespuesta(data.id,"Error de la SET BIG-IP logout page", respuestaSuccess.data);
                        }
                    } else {
                        respuesta = await crearRespuesta(data.id,"Error de conexión con la SET", respuestaSuccess.data);
                    }
                    console.log(respuesta); // Aquí puedes guardar la respuesta en una base de datos o archivo si lo necesitas
                    resolve(respuesta);
                })
                .catch(async (err) => {
                    console.error(`❌ error al realizar envio de lote`,err);
                    if (err.response?.data.startsWith("<?xml")) {
                        
                        respuesta = await crearRespuesta(data.id,err.response?.data, '')
                    } else {
                        respuesta = await crearRespuesta(data.id,"Error en la solicitud a la SET", err.response?.data || err.response||err||null);
                        console.error(respuesta); // Puedes guardar este error en logs
                        reject(respuesta);
                    }
                });

        } catch (error) {
            let respuestaError = await crearRespuesta(data.id,"Error interno", error.message);
            reject(respuestaError);
        }
    });
}
 

module.exports = {
    consulta  
};