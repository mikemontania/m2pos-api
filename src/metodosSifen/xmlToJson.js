const xml2js = require("xml2js");
const xmlToJson = async (xml) => {
    const xmlutf8 = xml instanceof Buffer ? xml.toString('utf8') : xml; // Convertir solo si es Buffer
    console.log(xmlutf8);
    
    try {
        const parser = new xml2js.Parser({ explicitArray: false });
        const jsonResult = await parser.parseStringPromise(xmlutf8.trim()); // Trim final para evitar errores

        console.log('✅ XML convertido a JSON:', JSON.stringify(jsonResult, null, 2));
        return jsonResult;
    } catch (error) {
        console.error('❌ Error al convertir XML a JSON:', error);
        throw error;
    }
};



const extraerDatosRespuesta = async (xml) => {
    try {
        const jsonData = await xmlToJson(xml);

        // Accedemos al body de la respuesta
        const body = jsonData?.["env:Envelope"]?.["env:Body"];
        if (!body) return { error: "Formato de respuesta inválido (Body no encontrado)" };

        let respuesta = null;

        if (body["ns2:rResEnviLoteDe"]) {
            // Formato 1: Respuesta de Envío de Lote
            respuesta = body["ns2:rResEnviLoteDe"];
            return {
                codigo: respuesta["ns2:dCodRes"] || "No disponible",
                numeroLote: respuesta["ns2:dProtConsLote"] || null,
                observacion: respuesta["ns2:dMsgRes"] || "Sin observación",
            };
        } else if (body["ns2:rResEnviConsLoteDe"]) {
            // Formato 2: Respuesta de Consulta de Lote
            respuesta = body["ns2:rResEnviConsLoteDe"];
            return {
                codigo: respuesta["ns2:dCodResLot"] || "No disponible",
                numeroLote: respuesta["ns2:dMsgResLot"]?.match(/\d+/)?.[0] || null, // Extrae el número del mensaje si está presente
                observacion: respuesta["ns2:gResProcLote"]?.["ns2:gResProc"]?.["ns2:dMsgRes"] || "Sin observación",
            };
        } else {
            return { error: "Formato de respuesta desconocido" };
        }
    } catch (error) {
        return { error: "Error al procesar la respuesta", detalle: error.message };
    }
};

module.exports = {
    xmlToJson,
    extraerDatosRespuesta
};