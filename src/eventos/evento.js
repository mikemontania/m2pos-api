 
const { generateXMLEventoService } = require("./eventoXml");
 
/*
Eventos
Para la invocación de Eventos de la SET se debe utilizar como primer parámetro, el mismo params utilizado en la Generación de XML.

El segundo parámetro data debe ser pasado en el siguiente formato, dependiendo del evento a ser invocado. A continuación los ejemplos para cada evento.
*/
/*Evento de Cancelación
{
    "cdc": "01800695631001001000000612021112917595714694",
    "motivo": "Se cancela este CDC"
}
Evento de Inutilización
{
    "tipoDocumento": 1,
    "establecimiento": "001",
    "punto": "001",
    "desde": 10,
    "hasta": 12,
    "motivo": "Se inutiliza la numeración"
}
Evento de Conformidad
{
    "cdc": "01800695631001001000000812021112910953738413",
    "tipoConformidad": 1,
    "fechaRecepcion": "2022-01-31T00:01:01"
}
Evento de Disconformidad
{
    "cdc": "01800695631001001000000812021112910953738413",
    "motivo": "Se informa de una disconformidad"
}
Evento de Desconocimiento
{
    "cdc": "01800695631001003000013712022010619364760029",
    "fechaEmision" : "2022-01-31T00:01:01",
    "fechaRecepcion" : "2022-01-31T00:01:01",
    "tipoReceptor" : 1,
    "nombre": "BRASIL CRESCENCIO",
    "ruc": "50062360-0",
    "documentoTipo": 1,
    "documentoNumero" : "",
    "motivo": "teste"
}
Evento de Notificación
{
    "cdc": "01800695631001003000013712022010619364760029",  
    "fechaEmision" : "2022-01-31T00:01:01",
    "fechaRecepcion" : "2022-01-31T00:01:01",
    "tipoReceptor" : 1,
    "nombre": "BRASIL CRESCENCIO",
    "ruc": "50062360-0",
    "documentoTipo": 1,
    "documentoNumero" : "",
    "totalPYG": 1550000
}*/





  const generateXMLEventoCancelacion =(  data   )=>{
    data.tipoEvento = 1; //Cancelacion
    return new Promise(async (resolve, reject) => {
      try {
        let xml = await generateXMLEventoService(data);
        xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');

        let soapXMLData = envelopeEvent(data.id, xml);
        resolve(soapXMLData);
      } catch (error) {
        reject(error);
      }
    });
  }

  const generateXMLEventoInutilizacion=( data   )=>{
    data.tipoEvento = 2; //Inutilizacion
    return new Promise(async (resolve, reject) => {
      try {
        let xml = await generateXMLEventoService( data);
                xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');

        let soapXMLData = envelopeEvent(data.id, xml);
    
        resolve(soapXMLData);
      } catch (error) {
        reject(error);
      }
    });
  }

  const generateXMLEventoConformidad =( data   )=>{
    data.tipoEvento = 11; //Conformidad
    return new Promise(async (resolve, reject) => {
      try {
        let xml = await generateXMLEventoService(data);
        xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');

        let soapXMLData = envelopeEvent(data.id, xml)(data);
        resolve(soapXMLData);
      } catch (error) {
        reject(error);
      }
    });
  }

  const generateXMLEventoDisconformidad=( data   )=>{
    data.tipoEvento = 12; //Disconformidad
    return new Promise(async (resolve, reject) => {
      try {
        let xml = await generateXMLEventoService(data);
        xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');

        let soapXMLData = envelopeEvent(data.id, xml)(data);
        resolve(soapXMLData);
      } catch (error) {
        reject(error);
      }
    });
  }

  const generateXMLEventoDesconocimiento=( data   )=>{
    data.tipoEvento = 13; //Desconocimiento
    return new Promise(async (resolve, reject) => {
      try {
        let xml = await generateXMLEventoService(data);
        xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');

        let soapXMLData = envelopeEvent(data.id, xml)(data);
        resolve(soapXMLData);
      } catch (error) {
        reject(error);
      }
    });
  }

  const generateXMLEventoNotificacion=( data   )=>{
    data.tipoEvento = 14; //Notificacion
    return new Promise(async (resolve, reject) => {
      try {
        let xml = await generateXMLEventoService(data);
        xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');

        let soapXMLData = envelopeEvent(data.id, xml)(data);
        resolve(soapXMLData);
      } catch (error) {
        reject(error);
      }
    });
  }

  const generateXMLEventoNominacion=(id , params , data , config )=>{
    data.tipoEvento = 15; //Nominacion
    return new Promise(async (resolve, reject) => {
      try {
         let xml = await generateXMLEventoService(data);
        xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');

        let soapXMLData = envelopeEvent(data.id, xml)(data);
        resolve(soapXMLData);
      } catch (error) {
        reject(error);
      }
    });
  }

  const generateXMLEventoActualizacionDatosTransporte=(id , params , data , config )=>{
    data.tipoEvento = 16; //ActualizacionDatosTransporte
    return new Promise(async (resolve, reject) => {
      try {
         let xml = await generateXMLEventoService(data);
        xml = xml.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', '');

        let soapXMLData = envelopeEvent(data.id, xml)(data);
        resolve(soapXMLData);
      } catch (error) {
        reject(error);
      }
    });
  }

  const envelopeEvent =(id , xml )=> {
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
  }
  
  const normalizeXML = (xml ) =>{
    xml = xml.split('\r\n').join('');
    xml = xml.split('\n').join('');
    xml = xml.split('\t').join('');
    xml = xml.split('    ').join('');
    xml = xml.split('>    <').join('><');
    xml = xml.split('>  <').join('><');
    xml = xml.replace(/\r?\n|\r/g, '');
    return xml;
  }
  
  module.exports = { 
    generateXMLEventoCancelacion,
    generateXMLEventoInutilizacion,
    generateXMLEventoConformidad,
    generateXMLEventoDisconformidad,
    generateXMLEventoDesconocimiento,
    generateXMLEventoNotificacion,
    generateXMLEventoNominacion,
    generateXMLEventoActualizacionDatosTransporte

  };
