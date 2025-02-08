const Certificado = require("../models/certificado.model");
const fs = require("fs");
const moment = require("moment");
const forge = require("node-forge"); 
const { decryptPassphrase } = require("../helpers/encript-helper");
const { openFileP12, getPrivateKey, getCertificate } = require('./p12');


const abrirCertificado = (certificado, passphrase) => {
    const p12 = openFileP12(certificado, passphrase);
    return {
      cert: getCertificate(p12),
      key: getPrivateKey(p12),
    };
  };
  
  const loadCertificateAndKey = async (empresaId) => {
    try {
      let condiciones = { activo: true };
      if (empresaId) condiciones.empresaId = empresaId;
  
      // Buscar el certificado en la base de datos
      let certificado = await Certificado.findOne({ where: condiciones });
      if (!certificado){
          console.log("No se encontró un certificado activo para la empresa");
       return   null;
      }
      if (certificado){
        if (!certificado.path || certificado.path < 15 ) {
            console.log("❌ ----------- No se encontró un path de certificado");
            return null;
        }
        if (!certificado.validoHasta || moment(certificado.validoHasta).isBefore(moment(), 'day')) { 
            console.log("❌ ----------- Certificado vencido");
            return null;
        }  
        if (
            !certificado.validoDesde || 
            !certificado.validoHasta || 
            moment(certificado.validoDesde).isAfter(moment(certificado.validoHasta))
        ) {
            console.log("❌ ----------- Certificado Incorrecto");
            return null;
        }  
    }
  
    
    const password = decryptPassphrase(certificado.passphrase); 
    
    // Reutilizamos abrirCertificado()
    const { cert, key } = abrirCertificado(`./src/certificado/${certificado.path}`, password);
    
    if (!cert || !key){
        console.log("❌ ----------- Error al obtener cert/key");
        return null;
    }  
    certificado = {...certificado, cert, key, password }; 
      return certificado;
    } catch (error) {
      console.error("Error al cargar el certificado y la clave privada:", error);
     return null;
    }
  };

  module.exports = {
    abrirCertificado,
    loadCertificateAndKey,
     
};