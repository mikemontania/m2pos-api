"use strict";

const jszip = require("jszip"); 
const fs = require("fs");
const https = require("https");
const axios = require("axios"); 
const EnvioRespuesta = require("../models/envioRespuesta.model");
const wsdlConsultaLote = `${process.env.SIFEN_URL}de/ws/consultas/consulta-lote.wsdl`;

 const crearRespuesta = async (lote_id,respuesta, stacktrace = null) => {
    try { 
       if (respuesta)  fs.writeFileSync(`./respuestaLote${lote_id}.xml`, respuesta);
        let nuevaRespuesta = await EnvioRespuesta.create({
            respuesta:respuesta,
            stacktrace:stacktrace
        });

        console.log(`✅ Respuesta creada con ID: ${nuevaRespuesta.id}`);
        nuevaRespuesta.respuesta = nuevaRespuesta.respuesta.toString('utf8');
        return nuevaRespuesta;
    } catch (error) {
        console.error('❌ Error al guardar la respuesta:', error);
        throw error;
    }
};


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



const consultaLote = (id, loteId, certificado) => {
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
          
            //    <?xml version="1.0" encoding="UTF-8"?>\n\
            let soapXMLData =  `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">\n\
                                    <soap:Header/>\n\
                                    <soap:Body>\n\
                                        <xsd:rEnviConsLoteDe xmlns:xsd="http://ekuatia.set.gov.py/sifen/xsd">\n\
                                            <xsd:dId>${id}</xsd:dId>\n\
                                            <xsd:dProtConsLote>${loteId}</xsd:dProtConsLote>\n\
                                        </xsd:rEnviConsLoteDe>\n\
                                    </soap:Body>\n\
                                </soap:Envelope>`; 
                soapXMLData = normalizeXML(soapXMLData);
                soapXMLData= soapXMLData.replace(/>\s+</g, '><').trim();
            if (soapXMLData) {
                console.log("url", wsdlConsultaLote);
                console.log("soapXMLData", soapXMLData);
            }
            //Escribo el archivo para verificacion
            if (defaultConfig.saveRequestFile) {
                const json = fs.writeFileSync(defaultConfig.saveRequestFile, soapXMLData);
            }

            const headers = {
                headers: {
                    "User-Agent": "facturaSend",
                    "Content-Type": "application/soap+xml",
                },
                httpsAgent,
                timeout: defaultConfig.timeout,
            }
            console.log(headers)
            console.log(wsdlConsultaLote)
            axios.post(wsdlConsultaLote, soapXMLData, headers)
                .then(async (respuestaSuccess) => {
                    let respuesta;
                    if (respuestaSuccess.status === 200) {
                        if (respuestaSuccess.data.startsWith("<?xml")) {
                             respuesta = await crearRespuesta(loteId,respuestaSuccess.data, '')
                        } else {
                            respuesta = await crearRespuesta(loteId,"Error de la SET BIG-IP logout page", respuestaSuccess.data);
                        }
                    } else {
                        respuesta = await crearRespuesta(loteId,"Error de conexión con la SET", respuestaSuccess.data);
                    }
                    console.log(respuesta); // Aquí puedes guardar la respuesta en una base de datos o archivo si lo necesitas
                    resolve(respuesta);
                })
                .catch(async (err) => {
                    console.error(`❌ error al realizar envio de lote`,err);
                    if (err.response?.data.startsWith("<?xml")) {
                        
                        respuesta = await crearRespuesta(loteId,err.response?.data, '')
                    } else {
                        respuesta = await crearRespuesta(loteId,"Error en la solicitud a la SET", err.response?.data || err.response||err||null);
                        console.error(respuesta); // Puedes guardar este error en logs
                        reject(respuesta);
                    }
                });

        } catch (error) {
            let respuestaError = await crearRespuesta(loteId,"Error interno", error.message);
            reject(respuestaError);
        }
    });
}

module.exports = {
    consultaLote
};