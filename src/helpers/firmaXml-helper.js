

const fs = require('fs');
const { SignedXml } = require('xml-crypto');
const { DOMParser } = require('@xmldom/xmldom');

/**
 * Función para firmar un XML con un certificado digital
 * @param {string} xml - El XML en formato string a firmar
 * @param {string} certPath - Ruta al archivo del certificado (pem)
 * @param {string} keyPath - Ruta al archivo de la clave privada (pem)
 * @param {string} passphrase - Clave de la clave privada
 * @returns {string} - XML firmado
 */
function signXML(xml, certPath, keyPath, passphrase) {
  // Leer el certificado y la clave privada
  const cert = fs.readFileSync(certPath, 'utf8');
  const key = fs.readFileSync(keyPath, 'utf8');

  // Crear un nuevo objeto SignedXml
  const sig = new SignedXml();
  sig.addReference("//*[local-name(.)='Factura']"); // Ajusta el nodo firmado
  sig.signingKey = privateKey;
  sig.keyInfoProvider = {
    getKeyInfo: () => `<X509Data><X509Certificate>${publicCert}</X509Certificate></X509Data>`,
  };
   

  // Cargar el XML a firmar
  const doc = new DOMParser().parseFromString(xml);
  sig.computeSignature(doc);

  // Retornar el XML firmado
  return sig.getSignedXml();
}




module.exports = { signXML  };
