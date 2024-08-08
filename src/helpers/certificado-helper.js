const fs = require("fs");
const forge = require("node-forge");
const Certificado = require("../models/certificado.model");
const { decryptPassphrase } = require("../helpers/encript-helper");
const { SignedXml } = require("xml-crypto");
 
// Función para obtener la clave privada en formato PEM
const getPrivateKey = p12 => {
  for (let i = 0; i < p12.safeContents.length; i++) {
    const safeBags = p12.safeContents[i].safeBags;
    for (let j = 0; j < safeBags.length; j++) {
      if (safeBags[j].key) {
        return forge.pki.privateKeyToPem(safeBags[j].key);
      }
    }
  }
  return null;
};

// Función para obtener el certificado en formato PEM
const getCertificate = p12 => {
  for (let i = 0; i < p12.safeContents.length; i++) {
    const safeBags = p12.safeContents[i].safeBags;
    for (let j = 0; j < safeBags.length; j++) {
      if (safeBags[j].cert) {
        return forge.pki.certificateToPem(safeBags[j].cert);
      }
    }
  }
  return null;
};
 

const loadCertificateAndKey = async empresaId => {
  try {
    let condiciones = { activo: true };
    if (empresaId) condiciones.empresaId = empresaId;

    // Solo devolverá un certificado por empresa
    const certificados = await Certificado.findAll({ where: condiciones });
    if (certificados.length === 0)
      throw new Error("No se encontró un certificado activo para la empresa");
    console.log("Certificado", certificados[0]);
    console.log(certificados[0].passphrase);

    const password = decryptPassphrase(certificados[0].passphrase);

    const path = `./src/certificado/${certificados[0].path}`;
    console.log("password", password);
    console.log("path", path);
    const p12File = fs.readFileSync(path);
    const p12Asn1 = forge.asn1.fromDer(p12File.toString("binary"), true);
    let p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
    
    let cert = getCertificate(p12);
    let key = getPrivateKey(p12);
    if (!cert) {
      reject("Antes debe Autenticarse");
    }
    if (!key) {
      reject("Antes debe autenticarse");
    }
    return { cert, key, password };
   } catch (error) {
    console.error("Error al cargar el certificado y la clave privada:", error);
    throw error;
  }
};

 
// Función para cargar el certificado y la clave privada desde un archivo .p12
/* const loadCertificateAndKey = async empresaId => {
  try {
    let condiciones = { activo: true };
    if (empresaId) condiciones.empresaId = empresaId;

    // Solo devolverá un certificado por empresa
    const certificados = await Certificado.findAll({ where: condiciones });
    if (certificados.length === 0)
      throw new Error("No se encontró un certificado activo para la empresa");
    console.log("Certificado", certificados[0]);
    console.log(certificados[0].passphrase);

    const password = decryptPassphrase(certificados[0].passphrase);

    const path = `./src/certificado/${certificados[0].path}`;
    console.log("password", password);
    console.log("path", path);
    const p12File = fs.readFileSync(path);
    const p12Asn1 = forge.asn1.fromDer(p12File.toString("binary"), true);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
    const cert = certBags[forge.pki.oids.certBag][0].cert;

    const privateKeyBags = p12.getBags({
      bagType: forge.pki.oids.pkcs8ShroudedKeyBag
    });
    const privateKey =
      privateKeyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;

    return { cert, privateKey };
  } catch (error) {
    console.error("Error al cargar el certificado y la clave privada:", error);
    throw error;
  }
}; */

// Función para firmar un XML usando la clave privada
const signXml = async (xmlData, empresaId) => {
  try {
    const { cert, key, password } = await loadCertificateAndKey(empresaId);

    const sig = new SignedXml({
      publicKey: cert,
      privateKey: key,
      passphrase: password,
      getKeyInfoContent: (publicKey, prefix) => {
        const certContent = cert.replace(/(?:\r\n|\r|\n)/g, ""); // Remover saltos de línea del certificado
        return `<X509Data><X509Certificate>${certContent}</X509Certificate></X509Data>`;
    }, 
    });

    sig.signatureAlgorithm =
      "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
    sig.canonicalizationAlgorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";

    // Verifica que el XML de entrada es el correcto
    console.log("XML de entrada:", xmlData);

    sig.addReference({
      xpath: "//*[local-name()='DE']",
      digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
      transforms: [
        "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
        "http://www.w3.org/2001/10/xml-exc-c14n#"
      ]
    });

    // Calcular la firma
    sig.computeSignature(xmlData, {
      location: {
        reference: "//*[local-name()='DE']",
        action: "after"
      }
    });

    // Obtener el XML firmado
    const signedXml = sig.getSignedXml();
    console.log("XML firmado:", signedXml);

    return signedXml;
  } catch (error) {
    console.error("Error al firmar el XML:", error);
    throw error;
  }
};

// Exportar las funciones para ser utilizadas en otros archivos del proyecto
module.exports = { signXml, loadCertificateAndKey  };
