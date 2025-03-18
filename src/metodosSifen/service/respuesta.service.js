"use strict";
 
const fs = require("fs"); 
const EnvioRespuesta = require("../../models/envioRespuesta.model");
 

const crearRespuesta1 = async ( respuesta, stacktrace = null) => {
    console.log(respuesta)
    try { 
       //if (respuesta)  fs.writeFileSync(`./respuestaLote.xml`, respuesta);
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

 
 const crearRespuesta = async (lote_id,respuesta, stacktrace = null) => {
    console.log(respuesta)
    try { 
      // if (respuesta)  fs.writeFileSync(`./respuestaLote${lote_id}.xml`, respuesta);
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
   
module.exports = { 
    crearRespuesta,
    crearRespuesta1
};