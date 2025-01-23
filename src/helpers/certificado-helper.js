const fs = require("fs");
const forge = require("node-forge");
const Certificado = require("../models/certificado.model");
const { decryptPassphrase } = require("../helpers/encript-helper");
const { SignedXml } = require("xml-crypto");
const https = require("https");
const xmlsign = require("facturacionelectronicapy-xmlsign").default;

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

const getxml = async () => {
  try {
    const path = `./src/certificado/factura.xml`;
    const xml = fs.readFileSync(path, "utf8"); // Lee el archivo y conviértelo a una cadena de texto

    return xml;
  } catch (error) {
    console.error("Error al cargar el XML:", error);
    throw error;
  }
};

const firmarXml = async (xmlString, empresaId) => {
  let condiciones = { activo: true };
  if (empresaId) condiciones.empresaId = empresaId;

  // Solo devolverá un certificado por empresa
  const certificados = await Certificado.findAll({ where: condiciones });
  if (certificados.length === 0)
    throw new Error("No se encontró un certificado activo para la empresa");
  console.log("Certificado", certificados[0]);
  console.log(certificados[0].passphrase);

  const passCert = decryptPassphrase(certificados[0].passphrase);
  const pathCert = `./src/certificado/${certificados[0].path}`;
  try {
    // Firmar el XML usando una promesa
    const xmlFirmado = await new Promise((resolve, reject) => {
      xmlsign
        .signXML(xmlString, pathCert, passCert)
        .then(signedXml => {
          console.log("XML firmado:", signedXml);
          resolve(signedXml); // Resolver la promesa con el XML firmado
        })
        .catch(err => {
          console.error("Error al firmar el XML:", err);
          reject(xmlString); // Rechazar la promesa en caso de error
        });
    });

    return xmlFirmado; // Devolver el XML firmado
  } catch (error) {
    console.error("Error en firmarXml:", error);
    return xmlString; // Devolver el XML original en caso de error
  }
};

// Función para firmar un XML usando la clave privada
const signXml = async (xmlData, empresaId) => {
  try {
    const { cert, key, password } = await loadCertificateAndKey(empresaId);

    // Función para limpiar el certificado (eliminar delimitadores y saltos de línea)
    const cleanCertificate = cert =>
      cert
        .replace(/-----BEGIN CERTIFICATE-----/g, "")
        .replace(/-----END CERTIFICATE-----/g, "")
        .replace(/(?:\r\n|\r|\n)/g, ""); // Eliminar saltos de línea

    const sig = new SignedXml({
      publicKey: cert,
      privateKey: key,
      passphrase: password,
      getKeyInfoContent: (publicKey, prefix) => {
        const certContent = cleanCertificate(cert); // Limpiar el certificado
        return `<X509Data><X509Certificate>${certContent}</X509Certificate></X509Data>`;
      }
    });

    // Verifica que el XML de entrada es el correcto
    console.log("XML de entrada:", xmlData);


    sig.addReference(
      /*"#" + idAtributo, */ {
        xpath: "//*[local-name()='DE']",
        digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256",
        transforms: [
          "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
          "http://www.w3.org/2001/10/xml-exc-c14n#"
          //"http://www.w3.org/2000/09/xmldsig#enveloped-signature",
         // "http://www.w3.org/2001/10/xml-exc-c14n#",
        ],
      });
      sig.canonicalizationAlgorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
     // sig.canonicalizationAlgorithm = "http://www.w3.org/2001/10/xml-exc-c14n#WithComments";
      sig.signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";  
    // Calcular la firma
    sig.computeSignature(xmlData, {
      location: {
        reference: "//*[local-name()='DE']",
        action: "after",
      },
    });
    
    // Obtener el XML firmado 
    return sig.getSignedXml();
  } catch (error) {
    console.error("Error al firmar el XML:", error);
    throw error;
  }
};

// Exportar las funciones para ser utilizadas en otros archivos del proyecto
module.exports = { signXml, loadCertificateAndKey, getxml, firmarXml };
